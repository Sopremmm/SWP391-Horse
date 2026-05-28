package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Lấy danh sách thông báo của người dùng, sắp xếp thông báo mới nhất lên đầu
    List<Notification> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);
}