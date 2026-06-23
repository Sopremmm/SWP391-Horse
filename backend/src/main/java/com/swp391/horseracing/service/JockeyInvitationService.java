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
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found!"));
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        // JKY-01: Jockey assigned <= 1 horse per race
        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        boolean alreadyAssigned = entries.stream()
                .anyMatch(e -> e.getJockey() != null && e.getJockey().getId().equals(jockeyId));
        if (alreadyAssigned) {
            throw new RuntimeException("Error: Jockey already assigned to another horse in this race (JKY-01)");
        }

        JockeyInvitation invitation = JockeyInvitation.builder()
                .horse(horse)
                .jockey(jockey)
                .owner(owner)
                .race(race)
                .message(message)
                .status("PENDING")
                .invitedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24)) // JKY-02
                .build();

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

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus("EXPIRED");
            invitationRepository.save(invitation);
            throw new RuntimeException("Error: Invitation has expired (JKY-02)");
        }

        invitation.setStatus(status);
        invitation.setRespondedAt(LocalDateTime.now());

        if ("ACCEPTED".equals(status)) {
            // Update RaceEntry with the jockey
            List<RaceEntry> entries = raceEntryRepository.findByHorseId(invitation.getHorse().getId());
            RaceEntry entry = entries.stream()
                    .filter(e -> e.getRace() != null && e.getRace().getId().equals(invitation.getRace().getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Error: Race entry not found for this horse and race!"));
            
            entry.setJockey(invitation.getJockey());
            raceEntryRepository.save(entry);
        }

        return invitationRepository.save(invitation);
    }

    public List<JockeyInvitation> getJockeyInvitations(Long jockeyId) {
        return invitationRepository.findByJockeyId(jockeyId);
    }
}
