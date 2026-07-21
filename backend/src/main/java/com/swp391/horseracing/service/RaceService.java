package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.request.SaveTournamentBracketRequest;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.RaceRepository;
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

        if (qualifyingCount < qualifiers.size() || semifinalCount < semifinals.size()) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Bracket counts cannot be reduced because existing races may contain assignments or results.");
        }
        if (finals.size() > 1) {
            throw new ResponseStatusException(BAD_REQUEST,
                    "Tournament already contains more than one final race.");
        }

        LocalDate startDate = tournament.getStartDate() != null ? tournament.getStartDate() : LocalDate.now();
        int maxParticipants = tournament.getMaxHorses() != null && tournament.getMaxHorses() > 0
                ? tournament.getMaxHorses() : 12;

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
        return raceRepository.findByTournamentIdOrderByRoundNumberAscRaceDateAscIdAsc(tournamentId);
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
        return saved;
    }

    public List<Race> getRacesByTournament(Long tournamentId) {
        return raceRepository.findByTournamentId(tournamentId);
    }

    public Race getRaceById(Long id) {
        return raceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
    }
}
