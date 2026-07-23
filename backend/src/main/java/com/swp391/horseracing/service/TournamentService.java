package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.RaceRepository;
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
        if (tournament.getStartDate() == null || tournament.getEndDate() == null) {
            throw new RuntimeException("Error: Tournament start date and end date are required!");
        }
        if (tournament.getEndDate().isBefore(tournament.getStartDate())) {
            throw new RuntimeException("Error: Tournament end date cannot be before its start date!");
        }
        // TM-01: tournamentStart >= created + 7 days
        if (tournament.getStartDate().isBefore(LocalDate.now().plusDays(7))) {
            throw new RuntimeException("Error: Tournament start date must be at least 7 days after creation (TM-01)");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Error: Admin not found!"));
        tournament.setCreatedBy(admin);
        tournament.setStatus("DRAFT");
        if (tournament.getMaxHorses() == null || tournament.getMaxHorses() < 1) {
            tournament.setMaxHorses(20);
        }
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Tournament getTournamentById(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Tournament not found!"));
    }

    public void deleteTournament(Long id) {
        if (!tournamentRepository.existsById(id)) {
            throw new RuntimeException("Error: Tournament not found!");
        }
        tournamentRepository.deleteById(id);
    }

    @Autowired
    private com.swp391.horseracing.repository.RaceRepository raceRepository;

    public Tournament updateTournament(Long id, Tournament request) {
        Tournament tournament = getTournamentById(id);
        
        if (request.getName() != null) tournament.setName(request.getName());
        if (request.getDescription() != null) tournament.setDescription(request.getDescription());
        if (request.getMaxHorses() != null) tournament.setMaxHorses(request.getMaxHorses());
        if (request.getPrizePool() != null) tournament.setPrizePool(request.getPrizePool());
        if (request.getRegistrationStartDate() != null) tournament.setRegistrationStartDate(request.getRegistrationStartDate());
        if (request.getRegistrationEndDate() != null) tournament.setRegistrationEndDate(request.getRegistrationEndDate());
        if (request.getStartDate() != null) tournament.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) tournament.setEndDate(request.getEndDate());
        if (request.getLocation() != null) tournament.setLocation(request.getLocation());
        if (request.getImageUrl() != null) tournament.setImageUrl(request.getImageUrl());
        
        return tournamentRepository.save(tournament);
    }

    public Tournament updateStatus(Long id, String status) {
        Tournament tournament = getTournamentById(id);

        // TM-02: Minimum Races >= 2 before publishing (OPEN)
        if ("OPEN".equals(status)) {
            List<Race> races = raceRepository.findByTournamentId(id);
            if (races.size() < 2) {
                throw new RuntimeException("Error: Tournament must have at least 2 scheduled races to be published (TM-02)");
            }
            tournament.setBracketPublished(true);
            races.forEach(r -> r.setPublished(true));
            raceRepository.saveAll(races);
        }

        tournament.setStatus(status);
        return tournamentRepository.save(tournament);
    }
}
