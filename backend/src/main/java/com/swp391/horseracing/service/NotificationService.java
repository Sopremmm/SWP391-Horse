package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.NotificationResponse;
import com.swp391.horseracing.entity.Notification;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.NotificationRepository;
import com.swp391.horseracing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Tạo notification cho 1 user
    @Transactional
    public Notification createNotification(Long userId, String title, String message,
                                           String type, Long refId, String refType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = Notification.create(user, title, message, type, refId, refType);
        return notificationRepository.save(notification);
    }

    // Tạo notification cho nhiều user (VD: thông báo đến tất cả chủ ngựa)
    @Transactional
    public List<Notification> createBulkNotifications(List<Long> userIds, String title, String message,
                                                      String type, Long refId, String refType) {
        List<User> users = userRepository.findAllById(userIds);
        List<Notification> notifications = users.stream()
                .map(user -> Notification.create(user, title, message, type, refId, refType))
                .collect(Collectors.toList());
        return notificationRepository.saveAll(notifications);
    }

    // Lấy notification chưa đọc của user
    public List<NotificationResponse> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Lấy tất cả notification của user (có phân trang)
    public Page<NotificationResponse> getNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Notification> notificationPage = notificationRepository.findByUserId(userId, pageable);
        return notificationPage.map(NotificationResponse::fromEntity);
    }

    // Đánh dấu 1 notification đã đọc
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        int updated = notificationRepository.markAsRead(userId, notificationId);
        if (updated == 0) {
            throw new RuntimeException("Notification not found or not owned by user");
        }
    }

    // Đánh dấu tất cả đã đọc
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    // Đếm số notification chưa đọc
    public int getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // Xóa notification cũ (có thể chạy schedule)
    @Transactional
    public void deleteOldNotifications(int daysOld) {
        // Có thể implement nếu cần
    }
}