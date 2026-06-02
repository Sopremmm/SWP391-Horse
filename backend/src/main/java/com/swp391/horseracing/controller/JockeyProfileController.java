package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.JockeyProfileRequest;
import com.swp391.horseracing.dto.MessageResponse;
import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.service.JockeyProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/jockey-profile")
@RequiredArgsConstructor
public class JockeyProfileController {
    private final JockeyProfileService jockeyProfileService;

    @PostMapping
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<JockeyProfile> createOrUpdateProfile(@Valid @RequestBody JockeyProfileRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(jockeyProfileService.createOrUpdateProfile(userDetails.getId(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<JockeyProfile> getMyProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(jockeyProfileService.getProfileByUserId(userDetails.getId()));
    }
}