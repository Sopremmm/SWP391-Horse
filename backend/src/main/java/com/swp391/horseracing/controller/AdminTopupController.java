package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.AdminMarkTopupPaidRequest;
import com.swp391.horseracing.dto.response.TopUpResponse;
import com.swp391.horseracing.entity.TopUpRequest;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/topups")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTopupController {
    @Autowired
    private WalletService walletService;

    @GetMapping
    public ResponseEntity<List<TopUpResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q
    ) {
        return ResponseEntity.ok(walletService.getAllTopUps(status, q));
    }

    @PostMapping("/{topupId}/mark-paid")
    public ResponseEntity<TopUpResponse> markPaid(
            @PathVariable Long topupId,
            @Valid @RequestBody AdminMarkTopupPaidRequest request,
            @AuthenticationPrincipal UserDetailsImpl admin
    ) {
        TopUpRequest saved = walletService.adminMarkPaid(admin.getId(), topupId, request.getBankTxnId());
        TopUpResponse res = new TopUpResponse();
        res.setId(saved.getId());
        if (saved.getUser() != null) {
            res.setUserId(saved.getUser().getId());
            res.setUserEmail(saved.getUser().getEmail());
            res.setUserFullName(saved.getUser().getFullName());
        }
        res.setAmount(saved.getAmount());
        res.setStatus(saved.getStatus());
        res.setReference(saved.getReference());
        res.setBankTxnId(saved.getBankTxnId());
        res.setCreatedAt(saved.getCreatedAt());
        res.setPaidAt(saved.getPaidAt());
        return ResponseEntity.ok(res);
    }
}
