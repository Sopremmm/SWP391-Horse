package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RaceEntryService {
    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public RaceEntry registerHorseToTournament(Long horseId, Long tournamentId, Long ownerId) {
        Horse horse = horseRepository.findById(horseId)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
        if (horse.getOwner() == null || horse.getOwner().getId() == null || !horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Error: You are not the owner of this horse!");
        }
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));

        if (!"OPEN".equalsIgnoreCase(tournament.getStatus())) {
            throw new RuntimeException("Error: Tournament registration is not open!");
        }
        if (!"ACTIVE".equalsIgnoreCase(horse.getStatus())) {
            throw new RuntimeException("Error: Only active horses can be registered!");
        }
        if (raceEntryRepository.findByTournamentIdAndHorseId(tournamentId, horseId) != null) {
            throw new RuntimeException("Error: This horse is already registered for the tournament!");
        }
        int registeredCount = raceEntryRepository.findByTournamentId(tournamentId).size();
        if (tournament.getMaxHorses() != null && registeredCount >= tournament.getMaxHorses()) {
            throw new RuntimeException("Error: Tournament has reached its horse limit!");
        }

        LocalDateTime now = LocalDateTime.now();
        if (tournament.getRegistrationStartDate() == null || tournament.getRegistrationEndDate() == null
                || now.toLocalDate().isBefore(tournament.getRegistrationStartDate())
                || now.toLocalDate().isAfter(tournament.getRegistrationEndDate())) {
            throw new RuntimeException("Error: Registration is outside the configured registration window!");
        }

        RaceEntry entry = RaceEntry.builder()
                .horse(horse)
                .tournament(tournament)
                .status("PENDING")
                .build();

        return raceEntryRepository.save(entry);
    }

    @Transactional
    public RaceEntry approveRegistration(Long entryId) {
        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        if (!"PENDING".equalsIgnoreCase(entry.getStatus())) {
            throw new RuntimeException("Error: Only pending entries can be approved!");
        }
        entry.setStatus("APPROVED");
        entry.setRejectionReason(null);
        entry.setApprovedAt(LocalDateTime.now());
        RaceEntry saved = raceEntryRepository.save(entry);
        if (saved.getHorse() != null && saved.getHorse().getOwner() != null && saved.getHorse().getOwner().getId() != null) {
            notificationService.sendNotification(
                    saved.getHorse().getOwner().getId(),
                    "Registration Approved",
                    "Your horse \"" + saved.getHorse().getName() + "\" has been approved for tournament \"" + saved.getTournament().getName() + "\".",
                    "REG_APPROVED",
                    saved.getId(),
                    "RACE_ENTRY"
            );
        }
        return saved;
    }

    @Transactional
    public RaceEntry rejectRegistration(Long entryId, String reason) {
        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        if (!"PENDING".equalsIgnoreCase(entry.getStatus())) {
            throw new RuntimeException("Error: Only pending entries can be rejected!");
        }
        entry.setStatus("REJECTED");
        entry.setRejectionReason(reason.trim());
        RaceEntry saved = raceEntryRepository.save(entry);
        if (saved.getHorse() != null && saved.getHorse().getOwner() != null && saved.getHorse().getOwner().getId() != null) {
            notificationService.sendNotification(saved.getHorse().getOwner().getId(), "Registration Rejected",
                    "Registration for horse \"" + saved.getHorse().getName() + "\" was rejected: " + saved.getRejectionReason(),
                    "REG_REJECTED", saved.getId(), "RACE_ENTRY");
        }
        return saved;
    }

    public List<RaceEntry> getEntriesByTournament(Long tournamentId) {
        return raceEntryRepository.findByTournamentId(tournamentId);
    }
}
