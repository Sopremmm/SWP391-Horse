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
import com.swp391.horseracing.repository.BetRepository;


@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final BetRepository betRepository;
    private final RaceRepository raceRepository;
    private final EmailService emailService;

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
    // Gửi notification kèm email
    @Transactional
    public Notification createNotificationWithEmail(Long userId, String title, String message,
                                                    String type, Long refId, String refType,
                                                    String recipientEmail) {
        Notification notification = createNotification(userId, title, message, type, refId, refType);

        if (recipientEmail != null && !recipientEmail.isEmpty()) {
            try {
                emailService.sendSimpleEmail(recipientEmail, title, message);
                notification.setEmailSent(true);
                notificationRepository.save(notification);
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
        }
        return notification;
    }

    // Gửi thông báo khi có kết quả race
    public void notifyRaceResult(Long raceId, Long winningEntryId) {
        Race race = raceRepository.findById(raceId).orElseThrow();
        List<Bet> bets = betRepository.findByRaceId(raceId);

        for (Bet bet : bets) {
            boolean isWin = bet.getPredictedEntry().getId().equals(winningEntryId);
            bet.setResult(isWin ? Bet.BetResult.WIN : Bet.BetResult.LOSE);
            bet.setResolvedAt(LocalDateTime.now());
            betRepository.save(bet);

            String title = isWin ? "🎉 Prediction WIN!" : "Prediction Result";
            String message = String.format(
                    "Your prediction for race '%s' was %s",
                    race.getName(), isWin ? "CORRECT! You won the prize!" : "incorrect"
            );

            createNotificationWithEmail(
                    bet.getSpectator().getId(),
                    title,
                    message,
                    "BET_RESULT",
                    raceId,
                    "Race",
                    bet.getSpectator().getEmail()
            );
        }
    }
}