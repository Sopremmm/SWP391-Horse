package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.JockeyInvitation;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.JockeyInvitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class JockeyInvitationController {
    @Autowired
    private JockeyInvitationService invitationService;

    @PostMapping
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<JockeyInvitation> inviteJockey(
            @RequestParam Long horseId,
            @RequestParam Long jockeyId,
            @RequestParam Long raceId,
            @RequestParam String message,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(invitationService.inviteJockey(horseId, jockeyId, raceId, userDetails.getId(), message));
    }

    @PatchMapping("/{id}/respond")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<JockeyInvitation> respondInvitation(@PathVariable Long id, @RequestParam String status, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(invitationService.respondToInvitation(id, status, userDetails.getId()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<List<JockeyInvitation>> getMyInvitations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(invitationService.getJockeyInvitations(userDetails.getId()));
    }
}
