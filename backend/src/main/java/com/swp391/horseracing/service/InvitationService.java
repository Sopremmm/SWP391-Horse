package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Invitation;
import com.swp391.horseracing.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private NotificationService notificationService;

    // Task 12: Xử lý logic Horse Owner gửi lời mời nài ngựa đến Jockey
    @Transactional
    public Invitation createInvitation(Invitation invitation) {
        invitation.setStatus("Pending");
        Invitation savedInvitation = invitationRepository.save(invitation);

        // Kích hoạt Task 14: Tự động gửi thông báo In-app báo cho Jockey biết
        String title = "Lời mời điều khiển ngựa thi đấu mới!";
        String message = "Bạn nhận được một lời mời tham gia cuộc đua (Mã cuộc đua: " + invitation.getRaceId() + "). Vui lòng kiểm tra và phản hồi.";
        notificationService.sendSystemNotification(invitation.getJockeyId(), title, message);

        return savedInvitation;
    }

    // Task 13: Xử lý logic Jockey Chấp nhận hoặc Từ chối lời mời
    @Transactional
    public Invitation respondToInvitation(Integer invitationId, String statusResponse) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lời mời ID: " + invitationId));

        if (!statusResponse.equalsIgnoreCase("Accepted") && !statusResponse.equalsIgnoreCase("Declined")) {
            throw new IllegalArgumentException("Trạng thái phản hồi không hợp lệ (Chỉ nhận 'Accepted' hoặc 'Declined')");
        }

        invitation.setStatus(statusResponse);
        Invitation updatedInvitation = invitationRepository.save(invitation);

        // Hệ thống tự động bắn thông báo kết quả ngược lại cho bên gửi (Tạm thời giả định người nhận là OwnerId hệ thống)
        String title = "Cập nhật trạng thái lời mời nài ngựa";
        String message = "Jockey phụ trách đã " + (statusResponse.equalsIgnoreCase("Accepted") ? "ĐỒNG Ý" : "TỪ CHỐI") + " lời mời tham gia trận đua số " + invitation.getRaceId();

        // Gửi thông báo đến tài khoản hệ thống của trận đấu (Sau này Trung map với ID cụ thể của HorseOwner)
        notificationService.sendSystemNotification(1, title, message);

        return updatedInvitation;
    }

    public List<Invitation> getInvitationsByJockey(Integer jockeyId) {
        return invitationRepository.findByJockeyId(jockeyId);
    }
}