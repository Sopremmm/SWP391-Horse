package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.CreateTopUpRequest;
import com.swp391.horseracing.dto.response.TopUpResponse;
import com.swp391.horseracing.dto.response.WalletSummaryResponse;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {
    @Autowired
    private WalletService walletService;

    @GetMapping("/summary")
    public ResponseEntity<WalletSummaryResponse> getSummary(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(walletService.getSummary(userDetails.getId()));
    }

    @PostMapping("/topups")
    public ResponseEntity<TopUpResponse> createTopup(@Valid @RequestBody CreateTopUpRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(walletService.createTopUp(userDetails.getId(), request.getAmount()));
    }

    @GetMapping("/topups/my")
    public ResponseEntity<List<TopUpResponse>> myTopups(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(walletService.getMyTopUps(userDetails.getId()));
    }
}

