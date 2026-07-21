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
    private NotificationService notificationService;

    public JockeyInvitation inviteJockey(Long horseId, Long jockeyId, Long raceId, Long ownerId, String message) {
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
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found!"));
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        RaceEntry horseEntry = raceEntryRepository.findByTournamentIdAndHorseId(
                race.getTournament().getId(), horseId);
        if (horseEntry == null || !"APPROVED".equals(horseEntry.getStatus())
                || horseEntry.getRace() == null || !raceId.equals(horseEntry.getRace().getId())) {
            throw new RuntimeException("Error: Horse must be approved for this race before inviting a jockey!");
        }

        // JKY-01: Jockey assigned <= 1 horse per race
        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        boolean alreadyAssigned = entries.stream()
                .anyMatch(e -> e.getJockey() != null && e.getJockey().getId().equals(jockeyId));
        if (alreadyAssigned) {
            throw new RuntimeException("Error: Jockey already assigned to another horse in this race (JKY-01)");
        }

        JockeyInvitation invitation = invitationRepository
                .findByHorseIdAndJockeyIdAndRaceId(horseId, jockeyId, raceId)
                .orElseGet(() -> JockeyInvitation.builder()
                        .horse(horse).jockey(jockey).owner(owner).race(race).build());
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
        invitation.setExpiresAt(LocalDateTime.now().plusHours(24));

        JockeyInvitation saved = invitationRepository.save(invitation);
        notificationService.sendNotification(
                jockey.getId(),
                "Jockey Invitation",
                "You have been invited to join race \"" + race.getName() + "\" with horse \"" + horse.getName() + "\".",
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
        if (invitation.getExpiresAt() == null || invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new RuntimeException("Error: Invitation has expired (JKY-02)");
        }

        invitation.setStatus(normalizedStatus);
        invitation.setRespondedAt(LocalDateTime.now());

        if ("ACCEPTED".equals(normalizedStatus)) {
            // Update RaceEntry with the jockey
            RaceEntry entry = raceEntryRepository.findByTournamentIdAndHorseId(
                    invitation.getRace().getTournament().getId(), invitation.getHorse().getId());
            if (entry == null || entry.getRace() == null
                    || !entry.getRace().getId().equals(invitation.getRace().getId())
                    || !"APPROVED".equals(entry.getStatus())) {
                throw new RuntimeException("Error: Approved race entry not found for this horse!");
            }
            
            entry.setJockey(invitation.getJockey());
            raceEntryRepository.save(entry);
        }

        return invitationRepository.save(invitation);
    }

    public List<JockeyInvitation> getJockeyInvitations(Long jockeyId) {
        return invitationRepository.findByJockeyId(jockeyId);
    }
}
