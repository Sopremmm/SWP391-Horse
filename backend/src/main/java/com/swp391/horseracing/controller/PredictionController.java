package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.PredictionRequest;
import com.swp391.horseracing.dto.PredictionResponse;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {
    private final PredictionService predictionService;

    // Task 21: Place prediction
    @PostMapping
    @PreAuthorize("hasRole('SPECTATOR')")
    public ResponseEntity<PredictionResponse> placePrediction(@Valid @RequestBody PredictionRequest request) {
        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(predictionService.placePrediction(user.getId(), request));
    }

    // Task 28: View my predictions list
    @GetMapping("/my-predictions")
    @PreAuthorize("hasRole('SPECTATOR')")
    public ResponseEntity<Page<PredictionResponse>> getMyPredictions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        UserDetailsImpl user = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(predictionService.getMyPredictions(user.getId(), page, size));
    }
}