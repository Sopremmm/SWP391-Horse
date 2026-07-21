package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.RefereeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referee/races")
public class RefereeController {
    @Autowired
    private RefereeService refereeService;

    @GetMapping("/{raceId}/entries")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<List<RaceEntry>> getEntries(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.getRaceEntriesForReferee(raceId, userDetails.getId()));
    }

    @PatchMapping("/{raceId}/checkin")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RaceEntry> checkIn(@PathVariable Long raceId, @Valid @RequestBody CheckInRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.checkInEntry(raceId, request.entryId, request.checkedIn, userDetails.getId()));
    }

    @PatchMapping("/{raceId}/no-show")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RaceEntry> markNoShow(@PathVariable Long raceId, @Valid @RequestBody NoShowRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.markNoShow(raceId, request.entryId, request.reason, userDetails.getId()));
    }

    @PostMapping("/{raceId}/violations")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RefereeReport> recordViolation(@PathVariable Long raceId, @Valid @RequestBody ViolationRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.recordViolation(raceId, request.entryId, request.message, userDetails.getId()));
    }

    @GetMapping("/{raceId}/results")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<List<RaceResult>> getResults(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.getRaceResultsForReferee(raceId, userDetails.getId()));
    }

    @PutMapping("/{raceId}/results")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<List<RaceResult>> upsertResults(@PathVariable Long raceId, @Valid @RequestBody List<ResultItemRequest> request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<RefereeService.ResultInput> inputs = request.stream()
                .map(i -> new RefereeService.ResultInput(i.entryId, i.finishRank, i.finishTimeMs))
                .toList();
        return ResponseEntity.ok(refereeService.upsertResults(raceId, inputs, userDetails.getId()));
    }

    @GetMapping("/{raceId}/report")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RefereeReport> getReport(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.getReportForReferee(raceId, userDetails.getId()));
    }

    @PutMapping("/{raceId}/report")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RefereeReport> saveDraft(@PathVariable Long raceId, @Valid @RequestBody ReportNotesRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.saveDraftReport(raceId, request.notes, userDetails.getId()));
    }

    @PostMapping("/{raceId}/report/submit")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RefereeReport> submit(@PathVariable Long raceId, @RequestBody(required = false) ReportNotesRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String notes = request == null ? null : request.notes;
        return ResponseEntity.ok(refereeService.submitReport(raceId, notes, userDetails.getId()));
    }

    @PostMapping("/{raceId}/report/confirm")
    @PreAuthorize("hasRole('REFEREE')")
    public ResponseEntity<RefereeReport> confirm(@PathVariable Long raceId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(refereeService.confirmReport(raceId, userDetails.getId()));
    }

    public static class CheckInRequest {
        @NotNull
        public Long entryId;

        @NotNull
        public Boolean checkedIn;
    }

    public static class NoShowRequest {
        @NotNull
        public Long entryId;

        public String reason;
    }

    public static class ViolationRequest {
        @NotNull
        public Long entryId;

        @NotBlank
        public String message;
    }

    public static class ResultItemRequest {
        @NotNull
        public Long entryId;

        @NotNull
        public Integer finishRank;

        public Long finishTimeMs;
    }

    public static class ReportNotesRequest {
        public String notes;
    }
}
