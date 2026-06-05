package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.MarkReadRequest;
import com.swp391.horseracing.dto.MessageResponse;
import com.swp391.horseracing.dto.NotificationResponse;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    // Lấy danh sách notification chưa đọc
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userDetails.getId()));
    }

    // Lấy danh sách tất cả notification (phân trang)
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(notificationService.getNotifications(userDetails.getId(), page, size));
    }

    // Đếm số notification chưa đọc
    @GetMapping("/unread/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getUnreadCount() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(notificationService.getUnreadCount(userDetails.getId()));
    }

    // Đánh dấu 1 notification đã đọc
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> markAsRead(@PathVariable Long id) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        notificationService.markAsRead(userDetails.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Notification marked as read"));
    }

    // Đánh dấu tất cả đã đọc
    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> markAllAsRead() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        notificationService.markAllAsRead(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
}