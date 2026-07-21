package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.AdminRaceResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/races")
public class AdminRaceResultController {
    @Autowired
    private AdminRaceResultService adminRaceResultService;

    @GetMapping("/{raceId}/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RefereeReport> getReport(@PathVariable Long raceId) {
        return ResponseEntity.ok(adminRaceResultService.getRefereeReport(raceId));
    }

    @PostMapping("/{raceId}/report/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RefereeReport> confirmReport(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl admin) {
        return ResponseEntity.ok(adminRaceResultService.confirmRefereeReport(admin.getId(), raceId));
    }

    @PostMapping("/{raceId}/publish-results")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Race> publish(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl admin) {
        return ResponseEntity.ok(adminRaceResultService.publishResults(admin.getId(), raceId));
    }
}
