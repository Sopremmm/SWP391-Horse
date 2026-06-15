package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.service.RaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {
    @Autowired
    private RaceService raceService;

    @PostMapping("/tournament/{tournamentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Race> createRace(@PathVariable Long tournamentId, @RequestBody Race race) {
        return ResponseEntity.ok(raceService.createRace(tournamentId, race));
    }

    @PatchMapping("/{id}/referee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Race> assignReferee(@PathVariable Long id, @RequestParam Long refereeId) {
        return ResponseEntity.ok(raceService.assignReferee(id, refereeId));
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<Race>> getRacesByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(raceService.getRacesByTournament(tournamentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Race> getRaceById(@PathVariable Long id) {
        return ResponseEntity.ok(raceService.getRaceById(id));
    }
}
