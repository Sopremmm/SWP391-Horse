package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.*;
import com.swp391.horseracing.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JockeyInvitationService {
    @Autowired
    private JockeyInvitationRepository invitationRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private JockeyProfileRepository jockeyProfileRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TournamentRepository tournamentRepository;

    public JockeyInvitation inviteJockey(Long horseId, Long jockeyId, Long tournamentId, Long ownerId, String message) {
        Horse horse = horseRepository.findById(horseId)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
        if (horse.getOwner() == null || horse.getOwner().getId() == null || !horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Error: You are not the owner of this horse!");
        }
        User jockey = userRepository.findById(jockeyId)
                .orElseThrow(() -> new RuntimeException("Error: Jockey not found!"));
        if (jockey.getRole() == null || !"JOCKEY".equals(jockey.getRole().name())) {
            throw new RuntimeException("Error: Selected user is not a jockey!");
        }
        if (jockey.getStatus() == null || !"ACTIVE".equals(jockey.getStatus().name())
                || jockeyProfileRepository.findByUserIdAndActiveTrue(jockeyId).isEmpty()) {
            throw new RuntimeException("Error: Selected jockey does not have an active profile!");
        }
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found!"));
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));

        RaceEntry horseEntry = raceEntryRepository.findByTournamentIdAndHorseId(tournamentId, horseId);
        if (horseEntry == null || !"APPROVED".equals(horseEntry.getStatus())) {
            throw new RuntimeException("Error: Horse must be approved for this tournament before inviting a jockey!");
        }
        // Bug 5 fix: Block invitation if this horse already has a jockey assigned
        if (horseEntry.getJockey() != null && horseEntry.getJockey().getId() != null) {
            throw new RuntimeException("Error: This horse already has a jockey assigned for this tournament!");
        }

        JockeyInvitation invitation = invitationRepository
                .findByHorseIdAndJockeyIdAndTournamentId(horseId, jockeyId, tournamentId)
                .orElseGet(() -> JockeyInvitation.builder()
                        .horse(horse).jockey(jockey).owner(owner).tournament(tournament).build());
        if ("PENDING".equals(invitation.getStatus()) && invitation.getExpiresAt() != null
                && invitation.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Error: A pending invitation already exists for this jockey and horse!");
        }
        if ("ACCEPTED".equals(invitation.getStatus())) {
            throw new RuntimeException("Error: This jockey has already accepted the invitation!");
        }
        invitation.setMessage(message == null ? "" : message.trim());
        invitation.setStatus("PENDING");
        invitation.setInvitedAt(LocalDateTime.now());
        invitation.setRespondedAt(null);
        invitation.setExpiresAt(tournament.getStartDate() != null ? tournament.getStartDate().atStartOfDay() : LocalDateTime.now().plusDays(7));

        JockeyInvitation saved = invitationRepository.save(invitation);
        notificationService.sendNotification(
                jockey.getId(),
                "Jockey Invitation",
                "You have been invited to join tournament \"" + tournament.getName() + "\" with horse \"" + horse.getName() + "\".",
                "JOCKEY_INVITE",
                saved.getId(),
                "JOCKEY_INVITATION"
        );
        return saved;
    }

    public JockeyInvitation respondToInvitation(Long id, String status, Long jockeyId) {
        JockeyInvitation invitation = invitationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Invitation not found!"));
        if (invitation.getJockey() == null || invitation.getJockey().getId() == null || !invitation.getJockey().getId().equals(jockeyId)) {
            throw new RuntimeException("Error: Invitation does not belong to current jockey!");
        }

        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();
        if (!List.of("ACCEPTED", "DECLINED").contains(normalizedStatus)) {
            throw new RuntimeException("Error: Invitation response must be ACCEPTED or DECLINED!");
        }
        if (!"PENDING".equals(invitation.getStatus())) {
            throw new RuntimeException("Error: Invitation has already been answered!");
        }
        if (invitation.getExpiresAt() == null || !invitation.getExpiresAt().isAfter(LocalDateTime.now())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new RuntimeException("Error: Invitation has expired (JKY-02)");
        }

        invitation.setStatus(normalizedStatus);
        invitation.setRespondedAt(LocalDateTime.now());

        if ("ACCEPTED".equals(normalizedStatus)) {
            RaceEntry entry = raceEntryRepository.findByTournamentIdAndHorseId(
                    invitation.getTournament().getId(), invitation.getHorse().getId());
            if (entry == null || (!"PENDING".equals(entry.getStatus()) && !"APPROVED".equals(entry.getStatus()) && !"CONFIRMED".equals(entry.getStatus()))) {
                throw new RuntimeException("Error: Valid race entry not found for this horse!");
            }
            // Bug 5 fix: Block accept if another jockey already claimed this horse
            if (entry.getJockey() != null && entry.getJockey().getId() != null
                    && !entry.getJockey().getId().equals(invitation.getJockey().getId())) {
                throw new RuntimeException("Error: Another jockey has already been assigned to this horse!");
            }
            entry.setJockey(invitation.getJockey());
            raceEntryRepository.save(entry);
        }
        JockeyInvitation saved = invitationRepository.save(invitation);
        notificationService.sendNotification(saved.getOwner().getId(), "Jockey Invitation Response",
                "Jockey \"" + saved.getJockey().getFullName() + "\" "
                        + ("ACCEPTED".equals(normalizedStatus) ? "accepted" : "declined")
                        + " the invitation for horse \"" + saved.getHorse().getName() + "\".",
                "SYSTEM", saved.getId(), "JOCKEY_INVITATION");
        return saved;
    }

    public List<JockeyInvitation> getJockeyInvitations(Long jockeyId) {
        return invitationRepository.findByJockeyId(jockeyId);
    }
}
