package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.JockeyProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jockeys")
public class JockeyProfileController {
    @Autowired
    private JockeyProfileService jockeyProfileService;

    @PostMapping("/profile")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<JockeyProfile> setupProfile(@RequestBody JockeyProfile profile, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(jockeyProfileService.setupProfile(profile, userDetails.getId()));
    }

    @GetMapping("/profile/my")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<JockeyProfile> getMyProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(jockeyProfileService.getProfile(userDetails.getId()));
    }
}
