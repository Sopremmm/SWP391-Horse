package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.InvitationRequest;
import com.swp391.horseracing.dto.InvitationResponse;
import com.swp391.horseracing.dto.MessageResponse;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.service.InvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class InvitationController {
    private final InvitationService invitationService;

    // Task 14: Gửi lời mời (Horse Owner)
    @PostMapping
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<InvitationResponse> sendInvitation(@Valid @RequestBody InvitationRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(invitationService.sendInvitation(userDetails.getId(), request));
    }

    // Task 15: Jockey accept invitation
    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<InvitationResponse> acceptInvitation(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(invitationService.acceptInvitation(id, userDetails.getId()));
    }

    // Task 15: Jockey decline invitation
    @PostMapping("/{id}/decline")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<InvitationResponse> declineInvitation(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(invitationService.declineInvitation(id, userDetails.getId()));
    }

    // Lấy danh sách invitation đang chờ của jockey
    @GetMapping("/my-pending")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<List<InvitationResponse>> getMyPendingInvitations() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(invitationService.getMyPendingInvitations(userDetails.getId()));
    }

    // Lấy danh sách invitation đã phản hồi của jockey
    @GetMapping("/my-responded")
    @PreAuthorize("hasRole('JOCKEY')")
    public ResponseEntity<List<InvitationResponse>> getMyRespondedInvitations() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(invitationService.getMyRespondedInvitations(userDetails.getId()));
    }
}