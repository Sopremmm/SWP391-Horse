package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {
    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/reports/pending")
    public ResponseEntity<List<RefereeReport>> pendingReports() {
        return ResponseEntity.ok(adminDashboardService.getReportsPendingConfirmation());
    }

    @GetMapping("/reports/publishable")
    public ResponseEntity<List<RefereeReport>> publishableReports() {
        return ResponseEntity.ok(adminDashboardService.getReportsReadyToPublish());
    }
}

