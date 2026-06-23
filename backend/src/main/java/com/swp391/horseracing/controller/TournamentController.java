package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Tournament;
import com.swp391.horseracing.dto.response.LeaderboardRowResponse;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.LeaderboardService;
import com.swp391.horseracing.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {
    @Autowired
    private TournamentService tournamentService;

    @Autowired
    private LeaderboardService leaderboardService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tournament> createTournament(@RequestBody Tournament tournament, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(tournamentService.createTournament(tournament, userDetails.getId()));
    }

    @GetMapping
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournamentById(id));
    }

    @GetMapping("/{id}/leaderboard")
    public ResponseEntity<List<LeaderboardRowResponse>> getLeaderboard(@PathVariable Long id) {
        return ResponseEntity.ok(leaderboardService.getTournamentLeaderboard(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Tournament> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(tournamentService.updateStatus(id, status));
    }
}
