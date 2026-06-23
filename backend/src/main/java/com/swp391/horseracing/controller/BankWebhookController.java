package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.BankWebhookRequest;
import com.swp391.horseracing.dto.response.MessageResponse;
import com.swp391.horseracing.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

@RestController
@RequestMapping("/api/payments/bank")
public class BankWebhookController {
    @Autowired
    private WalletService walletService;

    @PostMapping("/webhook")
    public ResponseEntity<MessageResponse> webhook(
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @Valid @RequestBody BankWebhookRequest request
    ) {
        String secret = walletService.getWebhookSecret();
        if (secret != null && !secret.isBlank()) {
            String expected = hmac(secret, buildPayload(request.getReference(), request.getStatus(), request.getAmount(), request.getBankTxnId()));
            if (signature == null || signature.isBlank() || !expected.equalsIgnoreCase(signature.trim())) {
                throw new RuntimeException("Error: Invalid webhook signature!");
            }
        }

        walletService.applyBankWebhook(
                request.getReference(),
                request.getStatus(),
                request.getAmount(),
                request.getBankTxnId()
        );

        return ResponseEntity.ok(new MessageResponse("OK"));
    }

    private static String buildPayload(String reference, String status, BigDecimal amount, String bankTxnId) {
        return (reference == null ? "" : reference.trim())
                + "|" + (status == null ? "" : status.trim().toUpperCase(Locale.ROOT))
                + "|" + (amount == null ? "" : amount.toPlainString())
                + "|" + (bankTxnId == null ? "" : bankTxnId.trim());
    }

    private static String hmac(String secret, String payload) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] raw = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error: Cannot verify signature!");
        }
    }
}

