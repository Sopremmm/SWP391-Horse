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

    public RaceEntry registerHorseToTournament(Long horseId, Long tournamentId, Long ownerId) {
        Horse horse = horseRepository.findById(horseId)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
        if (horse.getOwner() == null || horse.getOwner().getId() == null || !horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Error: You are not the owner of this horse!");
        }
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));

        // REG-01: Registration deadline <= raceStart - 24h (Applying to first race or tournament start)
        if (tournament.getStartDate().atStartOfDay().isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Error: Registration deadline passed (REG-01)");
        }

        RaceEntry entry = RaceEntry.builder()
                .horse(horse)
                .tournament(tournament)
                .status("PENDING")
                .build();

        return raceEntryRepository.save(entry);
    }

    public RaceEntry approveRegistration(Long entryId, Long raceId) {
        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        // REG-02: Maximum Participants <= 12
        List<RaceEntry> currentParticipants = raceEntryRepository.findByRaceId(raceId);
        if (currentParticipants.size() >= 12) {
            throw new RuntimeException("Error: Race is full (REG-02)");
        }

        // REG-04: Owner Participation Limit <= 3 per race
        long ownerHorseCount = currentParticipants.stream()
                .filter(e -> e.getHorse().getOwner().getId().equals(entry.getHorse().getOwner().getId()))
                .count();
        if (ownerHorseCount >= 3) {
            throw new RuntimeException("Error: Owner limit reached for this race (REG-04)");
        }

        entry.setRace(race);
        entry.setStatus("APPROVED");
        entry.setApprovedAt(LocalDateTime.now());
        RaceEntry saved = raceEntryRepository.save(entry);
        if (saved.getHorse() != null && saved.getHorse().getOwner() != null && saved.getHorse().getOwner().getId() != null) {
            notificationService.sendNotification(
                    saved.getHorse().getOwner().getId(),
                    "Registration Approved",
                    "Your horse \"" + saved.getHorse().getName() + "\" has been approved for race \"" + race.getName() + "\".",
                    "REG_APPROVED",
                    saved.getId(),
                    "RACE_ENTRY"
            );
        }
        return saved;
    }

    public RaceEntry rejectRegistration(Long entryId) {
        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        entry.setStatus("REJECTED");
        return raceEntryRepository.save(entry);
    }

    public List<RaceEntry> getEntriesByTournament(Long tournamentId) {
        return raceEntryRepository.findByTournamentId(tournamentId);
    }
}
