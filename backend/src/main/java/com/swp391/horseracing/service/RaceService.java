package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.TournamentRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RaceService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private UserRepository userRepository;

    public Race createRace(Long tournamentId, Race race) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));
        race.setTournament(tournament);
        race.setStatus("SCHEDULED");
        return raceRepository.save(race);
    }

    public Race assignReferee(Long raceId, Long refereeId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
        
        // RD-01: Referee assigned >= 24h before race
        if (race.getRaceDate().isBefore(LocalDateTime.now().plusHours(24))) {
            throw new RuntimeException("Error: Referee must be assigned at least 24h before the race (RD-01)");
        }

        User referee = userRepository.findById(refereeId)
                .orElseThrow(() -> new RuntimeException("Error: Referee not found!"));
        
        if (!referee.getRole().name().equals("REFEREE")) {
            throw new RuntimeException("Error: User is not a referee!");
        }

        race.setReferee(referee);
        return raceRepository.save(race);
    }

    public List<Race> getRacesByTournament(Long tournamentId) {
        return raceRepository.findByTournamentId(tournamentId);
    }

    public Race getRaceById(Long id) {
        return raceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
    }
}
