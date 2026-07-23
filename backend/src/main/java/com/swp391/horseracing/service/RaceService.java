package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.request.SaveTournamentBracketRequest;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.PrizeRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import com.swp391.horseracing.repository.TournamentRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class RaceService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    @Autowired
    private PrizeRepository prizeRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Race createRace(Long tournamentId, Race race) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));
        race.setTournament(tournament);
        race.setStatus("SCHEDULED");
        return raceRepository.save(race);
    }

    @Transactional
    public List<Race> saveTournamentBracket(Long tournamentId, SaveTournamentBracketRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));

        int qualifyingCount = request.getQualifyingRaces();
        int semifinalCount = request.getSemifinalRaces();
        if (semifinalCount > qualifyingCount) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Semi-final race count cannot exceed qualifying race count.");
        }

        List<Race> existing = new ArrayList<>(
                raceRepository.findByTournamentIdOrderByRoundNumberAscRaceDateAscIdAsc(tournamentId));
        List<Race> qualifiers = racesInRound(existing, 1);
        List<Race> semifinals = racesInRound(existing, 2);
        List<Race> finals = existing.stream().filter(race -> safeRound(race) >= 3).toList();

        if (finals.size() > 1) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Tournament already contains more than one final race.");
        }

        LocalDate startDate = tournament.getStartDate() != null ? tournament.getStartDate() : LocalDate.now();
        int maxParticipants = tournament.getMaxHorses() != null && tournament.getMaxHorses() > 0
                ? tournament.getMaxHorses() : 12;

        boolean structureChanged = qualifyingCount != qualifiers.size() || semifinalCount != semifinals.size();
        if (structureChanged) {
            assertBracketEditable(existing);
            detachTournamentEntries(tournamentId);

            List<Race> racesToRemove = new ArrayList<>();
            if (qualifyingCount < qualifiers.size()) {
                racesToRemove.addAll(qualifiers.subList(qualifyingCount, qualifiers.size()));
                qualifiers = new ArrayList<>(qualifiers.subList(0, qualifyingCount));
            }
            if (semifinalCount < semifinals.size()) {
                racesToRemove.addAll(semifinals.subList(semifinalCount, semifinals.size()));
                semifinals = new ArrayList<>(semifinals.subList(0, semifinalCount));
            }
            if (!racesToRemove.isEmpty()) {
                raceRepository.deleteAll(racesToRemove);
                raceRepository.flush();
            }
        }

        List<Race> newRaces = new ArrayList<>();
        for (int position = qualifiers.size() + 1; position <= qualifyingCount; position++) {
            newRaces.add(buildBracketRace(tournament,
                    tournament.getName() + " - Qualifying Race " + position,
                    1, scheduledAt(startDate, 0, position, 9), 1200, maxParticipants));
        }
        for (int position = semifinals.size() + 1; position <= semifinalCount; position++) {
            newRaces.add(buildBracketRace(tournament,
                    tournament.getName() + " - Semi-final Race " + position,
                    2, scheduledAt(startDate, 1, position, 9), 1400, maxParticipants));
        }
        if (finals.isEmpty()) {
            newRaces.add(buildBracketRace(tournament,
                    tournament.getName() + " - Grand Final",
                    3, LocalDateTime.of(startDate.plusDays(2), LocalTime.NOON), 1600, maxParticipants));
        }

        raceRepository.saveAll(newRaces);
        raceRepository.flush();

        // Gate allocation is intentionally a separate admin action. Automatically assigning
        // pending entries here previously bypassed the entry-approval workflow.
        return raceRepository.findByTournamentIdOrderByRoundNumberAscRaceDateAscIdAsc(tournamentId);
    }

    @Transactional
    public void deleteTournamentBracket(Long tournamentId) {
        if (!tournamentRepository.existsById(tournamentId)) {
            throw new ResponseStatusException(BAD_REQUEST, "Tournament not found.");
        }
        List<Race> races = raceRepository
                .findByTournamentIdOrderByRoundNumberAscRaceDateAscIdAsc(tournamentId);
        assertBracketEditable(races);
        detachTournamentEntries(tournamentId);
        raceRepository.deleteAll(races);
        raceRepository.flush();
    }

    private void assertBracketEditable(List<Race> races) {
        for (Race race : races) {
            boolean scheduled = race.getStatus() == null || race.getStatus().equalsIgnoreCase("SCHEDULED");
            boolean hasOfficialData = raceResultRepository.existsByRaceId(race.getId())
                    || refereeReportRepository.existsByRaceId(race.getId())
                    || prizeRepository.existsByRaceId(race.getId());
            if (!scheduled || hasOfficialData) {
                throw new ResponseStatusException(BAD_REQUEST,
                        "Bracket cannot be changed after a race has started or official results have been recorded.");
            }
        }
    }

    private void detachTournamentEntries(Long tournamentId) {
        List<RaceEntry> entries = raceEntryRepository.findByTournamentId(tournamentId);
        for (RaceEntry entry : entries) {
            entry.setRace(null);
            entry.setGateNumber(null);
        }
        raceEntryRepository.saveAll(entries);
        raceEntryRepository.flush();
    }

    private static List<Race> racesInRound(List<Race> races, int round) {
        return races.stream().filter(race -> safeRound(race) == round).toList();
    }

    private static int safeRound(Race race) {
        return race.getRoundNumber() == null ? 1 : race.getRoundNumber();
    }

    private static LocalDateTime scheduledAt(LocalDate startDate, int dayOffset, int position, int hour) {
        return LocalDateTime.of(startDate.plusDays(dayOffset), LocalTime.of(hour, 0))
                .plusMinutes((long) (position - 1) * 90);
    }

    private static Race buildBracketRace(Tournament tournament, String name, int round,
                                         LocalDateTime raceDate, int distance, int maxParticipants) {
        Race race = new Race();
        race.setTournament(tournament);
        race.setName(name);
        race.setRoundNumber(round);
        race.setRaceDate(raceDate);
        race.setDistanceM(distance);
        race.setMaxParticipants(maxParticipants);
        race.setStatus("SCHEDULED");
        return race;
    }

    public Race assignReferee(Long raceId, Long refereeId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        User referee = userRepository.findById(refereeId)
                .orElseThrow(() -> new RuntimeException("Error: Referee not found!"));
        
        if (!referee.getRole().name().equals("REFEREE")) {
            throw new RuntimeException("Error: User is not a referee!");
        }

        User previousReferee = race.getReferee();
        race.setReferee(referee);
        Race saved = raceRepository.save(race);
        notificationService.sendNotification(
                referee.getId(),
                "Race Assignment",
                "You have been assigned as referee for race \"" + saved.getName() + "\".",
                "SYSTEM",
                saved.getId(),
                "RACE"
        );
        if (previousReferee != null && previousReferee.getId() != null && !previousReferee.getId().equals(referee.getId())) {
            notificationService.sendNotification(previousReferee.getId(), "Race Assignment Changed",
                    "You are no longer assigned to race \"" + saved.getName() + "\".", "SYSTEM", saved.getId(), "RACE");
        }
        return saved;
    }

    public List<Race> getRacesByTournament(Long tournamentId) {
        return raceRepository.findByTournamentId(tournamentId);
    }

    public List<Race> getPublishedRacesByTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));
        // If the tournament is OPEN or beyond (active, completed), all races are visible
        String status = tournament.getStatus();
        if (status != null && (status.equalsIgnoreCase("OPEN") || status.equalsIgnoreCase("ONGOING")
                || status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("FINISHED"))) {
            return raceRepository.findByTournamentId(tournamentId);
        }
        if (!Boolean.TRUE.equals(tournament.getBracketPublished())) {
            return List.of();
        }
        return raceRepository.findByTournamentIdAndPublishedTrue(tournamentId);
    }

    public Race getRaceById(Long id) {
        return raceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
    }

    public Race getPublishedRaceById(Long id) {
        Race race = getRaceById(id);
        // If the tournament is OPEN or beyond, the race is visible
        if (race.getTournament() != null) {
            String status = race.getTournament().getStatus();
            if (status != null && (status.equalsIgnoreCase("OPEN") || status.equalsIgnoreCase("ONGOING")
                    || status.equalsIgnoreCase("COMPLETED") || status.equalsIgnoreCase("FINISHED"))) {
                return race;
            }
        }
        if (!Boolean.TRUE.equals(race.getPublished())) {
            throw new RuntimeException("Error: Race is not published!");
        }
        return race;
    }
}
