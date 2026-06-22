package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.AdminUpdateRaceStatusRequest;
import com.swp391.horseracing.dto.response.AdminRaceChecklistResponse;
import com.swp391.horseracing.dto.response.AdminRaceListItemResponse;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.AdminRaceControlService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/races")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRaceControlController {
    @Autowired
    private AdminRaceControlService adminRaceControlService;

    @GetMapping("/control")
    public ResponseEntity<List<AdminRaceListItemResponse>> list(
            @RequestParam(required = false) Long tournamentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(adminRaceControlService.listRaces(tournamentId, status, q, from, to));
    }

    @GetMapping("/{raceId}/checklist")
    public ResponseEntity<AdminRaceChecklistResponse> checklist(@PathVariable Long raceId) {
        return ResponseEntity.ok(adminRaceControlService.getChecklist(raceId));
    }

    @PatchMapping("/{raceId}/status")
    public ResponseEntity<Race> updateStatus(
            @PathVariable Long raceId,
            @Valid @RequestBody AdminUpdateRaceStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl admin
    ) {
        return ResponseEntity.ok(adminRaceControlService.updateRaceStatus(admin.getId(), raceId, request.getStatus()));
    }
}

