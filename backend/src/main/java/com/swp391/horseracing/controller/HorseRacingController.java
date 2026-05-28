package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Invitation;
import com.swp391.horseracing.entity.Notification;
import com.swp391.horseracing.service.InvitationService;
import com.swp391.horseracing.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Giúp tránh lỗi chặn CORS khi frontend của Tuấn gọi API lên
public class HorseRacingController {

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private NotificationService notificationService;

    // --- CÁC API ENDPOINT CHO LỜI MỜI (INVITATIONS) ---

    @PostMapping("/invitations")
    public ResponseEntity<Invitation> inviteJockey(@RequestBody Invitation invitation) {
        return ResponseEntity.ok(invitationService.createInvitation(invitation));
    }

    @PutMapping("/invitations/{id}/respond")
    public ResponseEntity<Invitation> respondInvitation(
            @PathVariable Integer id,
            @RequestParam String status) {
        return ResponseEntity.ok(invitationService.respondToInvitation(id, status));
    }

    @getMapping("/jockeys/{jockeyId}/invitations")
    public ResponseEntity<List<Invitation>> getMyInvitations(@PathVariable Integer jockeyId) {
        return ResponseEntity.ok(invitationService.getInvitationsByJockey(jockeyId));
    }

    // --- CÁC API ENDPOINT CHO THÔNG BÁO (NOTIFICATIONS) ---

    @GetMapping("/users/{userId}/notifications")
    public ResponseEntity<List<Notification>> getMyNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Đã đọc thông báo thành công!");
    }
}