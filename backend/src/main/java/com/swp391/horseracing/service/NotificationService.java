package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Notification;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.NotificationRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void sendNotification(Long userId, String title, String message, String type, Long refId, String refType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .refId(refId)
                .refType(refType)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    public List<Notification> getMyNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Notification not found!"));
        if (notification.getUser() == null || notification.getUser().getId() == null || !notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Error: Notification does not belong to current user!");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
}
