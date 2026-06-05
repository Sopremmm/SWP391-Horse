package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.InvitationRequest;
import com.swp391.horseracing.dto.InvitationResponse;
import com.swp391.horseracing.entity.*;
import com.swp391.horseracing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final JockeyInvitationRepository invitationRepository;
    private final HorseRepository horseRepository;
    private final RaceRepository raceRepository;
    private final UserRepository userRepository;
    private final RaceEntryRepository raceEntryRepository;
    private final NotificationService notificationService;

    private static final List<JockeyInvitation.InvitationStatus> ACTIVE_STATUSES =
            List.of(JockeyInvitation.InvitationStatus.PENDING);

    // Task 14: Gửi lời mời (Horse Owner)
    @Transactional
    public InvitationResponse sendInvitation(Long ownerId, InvitationRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.HORSE_OWNER) {
            throw new RuntimeException("Only horse owner can send invitations");
        }

        Horse horse = horseRepository.findById(request.getHorseId())
                .orElseThrow(() -> new RuntimeException("Horse not found"));

        if (!horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You don't own this horse");
        }

        User jockey = userRepository.findById(request.getJockeyId())
                .orElseThrow(() -> new RuntimeException("Jockey not found"));

        if (jockey.getRole() != User.Role.JOCKEY) {
            throw new RuntimeException("Invited user is not a jockey");
        }

        Race race = raceRepository.findById(request.getRaceId())
                .orElseThrow(() -> new RuntimeException("Race not found"));

        // Business rule JKY-01: Jockey exclusivity - 1 jockey chỉ 1 horse/race
        boolean alreadyInvited = invitationRepository.existsByHorseIdAndJockeyIdAndRaceIdAndStatusIn(
                request.getHorseId(), request.getJockeyId(), request.getRaceId(), ACTIVE_STATUSES);
        if (alreadyInvited) {
            throw new RuntimeException("This jockey already has a pending invitation for this race");
        }

        // Kiểm tra jockey đã được assign cho race này chưa (qua race_entry)
        // (Có thể implement thêm)

        // Business rule JKY-02: Invitation expires sau 24h
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

        JockeyInvitation invitation = new JockeyInvitation();
        invitation.setHorse(horse);
        invitation.setOwner(owner);
        invitation.setJockey(jockey);
        invitation.setRace(race);
        invitation.setStatus(JockeyInvitation.InvitationStatus.PENDING);
        invitation.setMessage(request.getMessage());
        invitation.setInvitedAt(LocalDateTime.now());
        invitation.setExpiresAt(expiresAt);

        JockeyInvitation saved = invitationRepository.save(invitation);

        // Tạo notification cho jockey
        notificationService.createNotification(
                jockey.getId(),
                "New Race Invitation",
                String.format("You have been invited to ride '%s' in race '%s'",
                        horse.getName(), race.getName()),
                "JOCKEY_INVITE",
                saved.getId(),
                "Invitation"
        );

        return InvitationResponse.fromEntity(saved);
    }

    // Task 15: Jockey accept invitation
    @Transactional
    public InvitationResponse acceptInvitation(Long invitationId, Long jockeyId) {
        JockeyInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getJockey().getId().equals(jockeyId)) {
            throw new RuntimeException("This invitation is not for you");
        }

        // Kiểm tra expiration
        if (invitation.isExpired()) {
            invitation.setStatus(JockeyInvitation.InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new RuntimeException("This invitation has expired");
        }

        // Business rule JKY-03: Confirmation deadline - raceStart - 12h
        LocalDateTime raceStart = invitation.getRace().getRaceDate();
        LocalDateTime deadline = raceStart.minusHours(12);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new RuntimeException("Cannot accept invitation: less than 12 hours before race start");
        }

        // Business rule JKY-01: Jockey exclusivity - kiểm tra jockey chưa được assign cho race này
        // (Có thể check race_entry)

        invitation.setStatus(JockeyInvitation.InvitationStatus.ACCEPTED);
        invitation.setRespondedAt(LocalDateTime.now());
        JockeyInvitation saved = invitationRepository.save(invitation);

        // Update hoặc tạo race_entry
        RaceEntry raceEntry = raceEntryRepository
                .findByHorseIdAndRaceId(invitation.getHorse().getId(), invitation.getRace().getId())
                .orElse(new RaceEntry());
        raceEntry.setHorse(invitation.getHorse());
        raceEntry.setJockey(invitation.getJockey());
        raceEntry.setTournament(invitation.getRace().getTournament());
        raceEntry.setRace(invitation.getRace());
        raceEntry.setStatus(RaceEntry.EntryStatus.CONFIRMED);
        raceEntryRepository.save(raceEntry);

        // Notification cho horse owner
        notificationService.createNotification(
                invitation.getOwner().getId(),
                "Jockey Accepted Invitation",
                String.format("Jockey '%s' has accepted to ride your horse '%s' in race '%s'",
                        invitation.getJockey().getFullName(),
                        invitation.getHorse().getName(),
                        invitation.getRace().getName()),
                "JOCKEY_ACCEPTED",
                saved.getId(),
                "Invitation"
        );

        return InvitationResponse.fromEntity(saved);
    }

    // Task 15: Jockey decline invitation
    @Transactional
    public InvitationResponse declineInvitation(Long invitationId, Long jockeyId) {
        JockeyInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getJockey().getId().equals(jockeyId)) {
            throw new RuntimeException("This invitation is not for you");
        }

        if (invitation.getStatus() != JockeyInvitation.InvitationStatus.PENDING) {
            throw new RuntimeException("This invitation has already been " + invitation.getStatus());
        }

        invitation.setStatus(JockeyInvitation.InvitationStatus.DECLINED);
        invitation.setRespondedAt(LocalDateTime.now());
        JockeyInvitation saved = invitationRepository.save(invitation);

        // Notification cho horse owner
        notificationService.createNotification(
                invitation.getOwner().getId(),
                "Jockey Declined Invitation",
                String.format("Jockey '%s' declined to ride your horse '%s' in race '%s'",
                        invitation.getJockey().getFullName(),
                        invitation.getHorse().getName(),
                        invitation.getRace().getName()),
                "JOCKEY_DECLINED",
                saved.getId(),
                "Invitation"
        );

        return InvitationResponse.fromEntity(saved);
    }

    // Lấy danh sách invitation của jockey (pending)
    public List<InvitationResponse> getMyPendingInvitations(Long jockeyId) {
        List<JockeyInvitation> invitations = invitationRepository
                .findByJockeyIdAndStatus(jockeyId, JockeyInvitation.InvitationStatus.PENDING);
        return invitations.stream()
                .map(InvitationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Lấy danh sách invitation đã response của jockey
    public List<InvitationResponse> getMyRespondedInvitations(Long jockeyId) {
        List<JockeyInvitation> invitations = invitationRepository
                .findByJockeyIdAndStatus(jockeyId, JockeyInvitation.InvitationStatus.ACCEPTED);
        invitations.addAll(invitationRepository
                .findByJockeyIdAndStatus(jockeyId, JockeyInvitation.InvitationStatus.DECLINED));
        return invitations.stream()
                .map(InvitationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Schedule: tự động expire invitation quá hạn (chạy mỗi giờ)
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void autoExpireInvitations() {
        int expired = invitationRepository.expirePendingInvitations(LocalDateTime.now());
        if (expired > 0) {
            System.out.println("Auto-expired " + expired + " invitations");
        }
    }
}