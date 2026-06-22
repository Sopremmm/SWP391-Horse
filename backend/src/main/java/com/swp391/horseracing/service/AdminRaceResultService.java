package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminRaceResultService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    @Autowired
    private PrizeService prizeService;

    @Autowired
    private ResultMatchingService resultMatchingService;

    @Autowired
    private AuditLogService auditLogService;

    public RefereeReport getRefereeReport(Long raceId) {
        return refereeReportRepository.findByRaceId(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Referee report not found!"));
    }

    public RefereeReport confirmRefereeReport(Long actorAdminId, Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        RefereeReport report = refereeReportRepository.findByRaceId(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Referee report not found!"));

        if (report.getConfirmed() != null && report.getConfirmed()) {
            return report;
        }
        if (report.getSubmitted() == null || !report.getSubmitted()) {
            throw new RuntimeException("Error: Report must be submitted before confirmation!");
        }

        report.setConfirmed(true);
        report.setConfirmedAt(LocalDateTime.now());
        RefereeReport saved = refereeReportRepository.save(report);

        if (!"COMPLETED".equalsIgnoreCase(race.getStatus())) {
            race.setStatus("FINISHED");
            raceRepository.save(race);
        }
        auditLogService.log(actorAdminId, "ADMIN_CONFIRM_REPORT", "RACE", raceId, "reportId=" + saved.getId());
        return saved;
    }

    public Race publishResults(Long actorAdminId, Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        RefereeReport report = refereeReportRepository.findByRaceId(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Referee report not found!"));
        if (report.getConfirmed() == null || !report.getConfirmed()) {
            throw new RuntimeException("Error: Referee report must be confirmed before publishing!");
        }

        race.setStatus("COMPLETED");
        Race saved = raceRepository.save(race);

        prizeService.calculateTop3ForRace(raceId);
        resultMatchingService.resolveBetsForRace(raceId);

        auditLogService.log(actorAdminId, "ADMIN_PUBLISH_RESULTS", "RACE", raceId, "status=COMPLETED");
        return saved;
    }
}
