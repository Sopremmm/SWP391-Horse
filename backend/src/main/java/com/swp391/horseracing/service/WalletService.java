package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.TopUpResponse;
import com.swp391.horseracing.dto.response.WalletSummaryResponse;
import com.swp391.horseracing.entity.TopUpRequest;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.TopUpRequestRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class WalletService {
    @Value("${app.bank.code:}")
    private String bankCode;

    @Value("${app.bank.account:}")
    private String bankAccount;

    @Value("${app.bank.account-name:}")
    private String bankAccountName;

    @Value("${app.bank.webhook.secret:}")
    private String webhookSecret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopUpRequestRepository topUpRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditLogService auditLogService;

    public WalletSummaryResponse getSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        WalletSummaryResponse res = new WalletSummaryResponse();
        res.setBalance(user.getBalance() == null ? BigDecimal.ZERO : user.getBalance());
        res.setBankCode(bankCode);
        res.setBankAccount(bankAccount);
        res.setBankAccountName(bankAccountName);
        return res;
    }

    @Transactional
    public TopUpResponse createTopUp(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Error: Amount must be positive!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        String reference = "TOPUP-" + userId + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT);

        TopUpRequest req = TopUpRequest.builder()
                .user(user)
                .amount(amount)
                .status("PENDING")
                .reference(reference)
                .build();
        TopUpRequest saved = topUpRequestRepository.save(req);

        return toResponse(saved, true);
    }

    public List<TopUpResponse> getMyTopUps(Long userId) {
        return topUpRequestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(r -> toResponse(r, false))
                .toList();
    }

    public List<TopUpResponse> getAllTopUps(String status, String q) {
        String statusNeedle = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        String textNeedle = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);
        return topUpRequestRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .filter(req -> statusNeedle.isBlank() || statusNeedle.equalsIgnoreCase(req.getStatus()))
                .filter(req -> {
                    if (textNeedle.isBlank()) return true;
                    String reference = req.getReference() == null ? "" : req.getReference().toLowerCase(Locale.ROOT);
                    String bankTxnId = req.getBankTxnId() == null ? "" : req.getBankTxnId().toLowerCase(Locale.ROOT);
                    String email = req.getUser() != null && req.getUser().getEmail() != null ? req.getUser().getEmail().toLowerCase(Locale.ROOT) : "";
                    String fullName = req.getUser() != null && req.getUser().getFullName() != null ? req.getUser().getFullName().toLowerCase(Locale.ROOT) : "";
                    return reference.contains(textNeedle) || bankTxnId.contains(textNeedle) || email.contains(textNeedle) || fullName.contains(textNeedle);
                })
                .map(req -> toResponse(req, false))
                .toList();
    }

    public String getWebhookSecret() {
        return webhookSecret;
    }

    @Transactional
    public TopUpRequest applyBankWebhook(String reference, String status, BigDecimal amount, String bankTxnId) {
        if (reference == null || reference.isBlank()) {
            throw new RuntimeException("Error: reference is required!");
        }

        TopUpRequest req = topUpRequestRepository.findByReference(reference.trim())
                .orElseThrow(() -> new RuntimeException("Error: Topup request not found!"));

        String normalizedStatus = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        if (!normalizedStatus.equals("SUCCESS") && !normalizedStatus.equals("PAID")) {
            return req;
        }

        if (req.getStatus() != null && req.getStatus().equalsIgnoreCase("PAID")) {
            return req;
        }

        if (amount != null && req.getAmount() != null && amount.compareTo(req.getAmount()) != 0) {
            throw new RuntimeException("Error: Amount mismatch!");
        }

        if (bankTxnId != null && !bankTxnId.isBlank()) {
            topUpRequestRepository.findByBankTxnId(bankTxnId.trim()).ifPresent(existing -> {
                if (!existing.getId().equals(req.getId())) {
                    throw new RuntimeException("Error: bankTxnId already used!");
                }
            });
            req.setBankTxnId(bankTxnId.trim());
        }

        req.setStatus("PAID");
        req.setPaidAt(LocalDateTime.now());
        TopUpRequest saved = topUpRequestRepository.save(req);

        User user = saved.getUser();
        BigDecimal current = user.getBalance() == null ? BigDecimal.ZERO : user.getBalance();
        BigDecimal inc = saved.getAmount() == null ? BigDecimal.ZERO : saved.getAmount();
        user.setBalance(current.add(inc));
        userRepository.save(user);

        notificationService.sendNotification(
                user.getId(),
                "Top-up Success",
                "Your wallet has been credited: +" + inc + ". Reference: " + saved.getReference(),
                "TOPUP_SUCCESS",
                saved.getId(),
                "TOPUP_REQUEST"
        );

        return saved;
    }

    @Transactional
    public TopUpRequest adminMarkPaid(Long actorAdminId, Long topupId, String bankTxnId) {
        TopUpRequest req = topUpRequestRepository.findById(topupId)
                .orElseThrow(() -> new RuntimeException("Error: Topup request not found!"));
        if (req.getStatus() != null && req.getStatus().equalsIgnoreCase("PAID")) {
            return req;
        }
        TopUpRequest saved = applyBankWebhook(req.getReference(), "PAID", req.getAmount(), bankTxnId);
        if (actorAdminId != null) {
            auditLogService.log(actorAdminId, "ADMIN_MARK_TOPUP_PAID", "TOPUP_REQUEST", saved.getId(), "reference=" + saved.getReference());
            notificationService.sendNotification(
                    saved.getUser().getId(),
                    "Top-up Approved (Admin)",
                    "Your top-up has been approved. Reference: " + saved.getReference(),
                    "TOPUP_APPROVED",
                    saved.getId(),
                    "TOPUP_REQUEST"
            );
        }
        return saved;
    }

    private TopUpResponse toResponse(TopUpRequest req, boolean includeQr) {
        TopUpResponse res = new TopUpResponse();
        res.setId(req.getId());
        if (req.getUser() != null) {
            res.setUserId(req.getUser().getId());
            res.setUserEmail(req.getUser().getEmail());
            res.setUserFullName(req.getUser().getFullName());
        }
        res.setAmount(req.getAmount());
        res.setStatus(req.getStatus());
        res.setReference(req.getReference());
        res.setBankTxnId(req.getBankTxnId());
        res.setCreatedAt(req.getCreatedAt());
        res.setPaidAt(req.getPaidAt());
        res.setBankCode(bankCode);
        res.setBankAccount(bankAccount);
        res.setBankAccountName(bankAccountName);

        String transferContent = req.getReference();
        res.setTransferContent(transferContent);

        if (includeQr && bankCode != null && !bankCode.isBlank() && bankAccount != null && !bankAccount.isBlank()) {
            String addInfo = URLEncoder.encode(transferContent, StandardCharsets.UTF_8);
            String name = URLEncoder.encode(bankAccountName == null ? "" : bankAccountName, StandardCharsets.UTF_8);
            String amount = URLEncoder.encode(String.valueOf(req.getAmount()), StandardCharsets.UTF_8);
            String url = "https://img.vietqr.io/image/" + bankCode + "-" + bankAccount + "-compact2.png?amount=" + amount + "&addInfo=" + addInfo + "&accountName=" + name;
            res.setQrImageUrl(url);
        }

        return res;
    }
}
