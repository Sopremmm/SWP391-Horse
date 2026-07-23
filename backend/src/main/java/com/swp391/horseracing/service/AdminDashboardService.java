package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {
    @Autowired
    private RefereeReportRepository refereeReportRepository;

    public List<RefereeReport> getReportsPendingConfirmation() {
        return refereeReportRepository.findBySubmittedTrueAndConfirmedFalseOrderBySubmittedAtDesc();
    }

    public List<RefereeReport> getReportsReadyToPublish() {
        return refereeReportRepository.findByConfirmedTrueOrderByConfirmedAtDesc().stream()
                .filter(r -> r.getRace() != null && r.getRace().getStatus() != null && !"COMPLETED".equalsIgnoreCase(r.getRace().getStatus()))
                .toList();
    }
}

