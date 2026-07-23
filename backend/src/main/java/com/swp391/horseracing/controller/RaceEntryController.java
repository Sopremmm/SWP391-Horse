package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.dto.request.AdminEntryDecisionRequest;
import jakarta.validation.Valid;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.RaceEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class RaceEntryController {
    @Autowired
    private RaceEntryService raceEntryService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<RaceEntry> registerHorse(@RequestParam Long horseId, @RequestParam Long tournamentId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(raceEntryService.registerHorseToTournament(horseId, tournamentId, userDetails.getId()));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RaceEntry> approveEntry(@PathVariable Long id) {
        return ResponseEntity.ok(raceEntryService.approveRegistration(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RaceEntry> rejectEntry(@PathVariable Long id, @Valid @RequestBody AdminEntryDecisionRequest request) {
        return ResponseEntity.ok(raceEntryService.rejectRegistration(id, request.getReason()));
    }

    @GetMapping("/tournament/{tournamentId}")
    @PreAuthorize("!hasRole('REFEREE')")
    public ResponseEntity<List<RaceEntry>> getEntriesByTournament(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(raceEntryService.getEntriesByTournament(tournamentId));
    }
}
