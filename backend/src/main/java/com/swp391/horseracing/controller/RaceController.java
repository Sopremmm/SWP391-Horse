package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.dto.request.SaveTournamentBracketRequest;
import com.swp391.horseracing.dto.response.PrizeResponse;
import com.swp391.horseracing.dto.response.PublicRaceResultsResponse;
import com.swp391.horseracing.service.PrizeService;
import com.swp391.horseracing.service.RaceResultQueryService;
import com.swp391.horseracing.service.RaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {
    @Autowired
    private RaceService raceService;

    @Autowired
    private RaceResultQueryService raceResultQueryService;

    @Autowired
    private PrizeService prizeService;

    @PostMapping("/tournament/{tournamentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Race> createRace(@PathVariable Long tournamentId, @RequestBody Race race) {
        return ResponseEntity.ok(raceService.createRace(tournamentId, race));
    }

    @PutMapping("/tournament/{tournamentId}/bracket")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Race>> saveTournamentBracket(
            @PathVariable Long tournamentId,
            @Valid @RequestBody SaveTournamentBracketRequest request) {
        return ResponseEntity.ok(raceService.saveTournamentBracket(tournamentId, request));
    }

    @DeleteMapping("/tournament/{tournamentId}/bracket")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTournamentBracket(@PathVariable Long tournamentId) {
        raceService.deleteTournamentBracket(tournamentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/referee")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Race> assignReferee(@PathVariable Long id, @RequestParam Long refereeId) {
        return ResponseEntity.ok(raceService.assignReferee(id, refereeId));
    }

    @GetMapping("/tournament/{tournamentId}")
    @PreAuthorize("!hasRole('REFEREE')")
    public ResponseEntity<List<Race>> getRacesByTournament(@PathVariable Long tournamentId, @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                ? raceService.getRacesByTournament(tournamentId) : raceService.getPublishedRacesByTournament(tournamentId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("!hasRole('REFEREE')")
    public ResponseEntity<Race> getRaceById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(user.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                ? raceService.getRaceById(id) : raceService.getPublishedRaceById(id));
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<PublicRaceResultsResponse> getRaceResults(@PathVariable Long id) {
        return ResponseEntity.ok(raceResultQueryService.getPublicRaceResults(id));
    }

    @GetMapping("/{id}/prizes")
    public ResponseEntity<List<PrizeResponse>> getRacePrizes(@PathVariable Long id) {
        return ResponseEntity.ok(prizeService.getPrizesByRace(id));
    }
}
