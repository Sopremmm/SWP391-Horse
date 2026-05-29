package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Notification;
import com.swp391.horseracing.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Hàm tạo nhanh thông báo hệ thống dùng chung cho toàn bộ dự án
    public void sendSystemNotification(Integer receiverId, String title, String message) {
        Notification notification = new Notification();
        notification.setReceiverId(receiverId);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    // Xem danh sách thông báo của User
    public List<Notification> getNotificationsForUser(Integer userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId);
    }

    // Đánh dấu đã đọc thông báo công việc
    public void markAsRead(Integer notificationId) {
        Notification noti = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo ID: " + notificationId));
        noti.setIsRead(true);
        notificationRepository.save(noti);
    }
}