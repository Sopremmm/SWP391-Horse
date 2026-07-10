package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.TournamentRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TournamentService {
    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private UserRepository userRepository;

    public Tournament createTournament(Tournament tournament, Long adminId) {
        // TM-01: tournamentStart >= created + 7 days
        if (tournament.getStartDate().isBefore(LocalDate.now().plusDays(7))) {
            throw new RuntimeException("Error: Tournament start date must be at least 7 days after creation (TM-01)");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Error: Admin not found!"));
        tournament.setCreatedBy(admin);
        tournament.setStatus("DRAFT");
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));
    }

    @Autowired
    private com.swp391.horseracing.repository.RaceRepository raceRepository;

    public Tournament updateStatus(Long id, String status) {
        Tournament tournament = getTournamentById(id);
        
        // TM-02: Minimum Races >= 2 before publishing (OPEN)
        if ("OPEN".equals(status)) {
            long raceCount = raceRepository.findByTournamentId(id).size();
            if (raceCount < 2) {
                throw new RuntimeException("Error: Tournament must have at least 2 scheduled races to be published (TM-02)");
            }
        }
        
        tournament.setStatus(status);
        return tournamentRepository.save(tournament);
    }
}
