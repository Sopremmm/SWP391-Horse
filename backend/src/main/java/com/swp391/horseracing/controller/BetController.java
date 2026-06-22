package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.PlaceBetRequest;
import com.swp391.horseracing.dto.response.BetResponse;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.BetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
public class BetController {
    @Autowired
    private BetService betService;

    @PostMapping("/race/{raceId}")
    @PreAuthorize("hasRole('SPECTATOR')")
    public ResponseEntity<BetResponse> placeBet(
            @PathVariable Long raceId,
            @Valid @RequestBody PlaceBetRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        return ResponseEntity.ok(betService.placeBet(userDetails.getId(), raceId, request.getPredictedEntryId()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('SPECTATOR')")
    public ResponseEntity<List<BetResponse>> myBets(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(betService.getMyBets(userDetails.getId()));
    }
}
