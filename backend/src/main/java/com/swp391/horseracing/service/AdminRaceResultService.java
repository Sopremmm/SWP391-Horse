package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.JockeyProfile;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.JockeyProfileRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminRaceResultService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    @Autowired
    private PrizeService prizeService;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private JockeyProfileRepository jockeyProfileRepository;

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
        updateParticipantStats(raceId);
        raceEntryRepository.findByRaceId(raceId).forEach(entry -> {
            if (entry.getHorse() != null && entry.getHorse().getOwner() != null) {
                notificationService.sendNotification(entry.getHorse().getOwner().getId(), "Race Results Published",
                        "Results are available for race \"" + race.getName() + "\".", "RACE_RESULT", raceId, "RACE");
            }
            if (entry.getJockey() != null) {
                notificationService.sendNotification(entry.getJockey().getId(), "Race Results Published",
                        "Results are available for race \"" + race.getName() + "\".", "RACE_RESULT", raceId, "RACE");
            }
        });

        auditLogService.log(actorAdminId, "ADMIN_PUBLISH_RESULTS", "RACE", raceId, "status=COMPLETED");
        return saved;
    }

    /**
     * Update totalRaces and totalWins for all horses and jockeys that participated in this race.
     */
    private void updateParticipantStats(Long raceId) {
        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        List<RaceResult> results = raceResultRepository.findByRaceIdOrderByFinishRankAsc(raceId);

        // Find the winner (rank 1) entry ID
        Long winnerEntryId = results.stream()
                .filter(r -> r.getFinishRank() != null && r.getFinishRank() == 1)
                .findFirst()
                .map(r -> r.getEntry() != null ? r.getEntry().getId() : null)
                .orElse(null);

        for (RaceEntry entry : entries) {
            String status = entry.getStatus();
            // Only count entries that actually participated (not WITHDRAWN, not NO_SHOW)
            if (status != null && (status.equalsIgnoreCase("WITHDRAWN"))) continue;
            if (Boolean.TRUE.equals(entry.getNoShow())) continue;

            // Update horse stats
            Horse horse = entry.getHorse();
            if (horse != null) {
                horse.setTotalRaces((horse.getTotalRaces() == null ? 0 : horse.getTotalRaces()) + 1);
                if (entry.getId() != null && entry.getId().equals(winnerEntryId)) {
                    horse.setTotalWins((horse.getTotalWins() == null ? 0 : horse.getTotalWins()) + 1);
                }
                horseRepository.save(horse);
            }

            // Update jockey stats
            if (entry.getJockey() != null && entry.getJockey().getId() != null) {
                Optional<JockeyProfile> profileOpt = jockeyProfileRepository.findByUserId(entry.getJockey().getId());
                if (profileOpt.isPresent()) {
                    JockeyProfile profile = profileOpt.get();
                    profile.setTotalRaces((profile.getTotalRaces() == null ? 0 : profile.getTotalRaces()) + 1);
                    if (entry.getId() != null && entry.getId().equals(winnerEntryId)) {
                        profile.setTotalWins((profile.getTotalWins() == null ? 0 : profile.getTotalWins()) + 1);
                    }
                    jockeyProfileRepository.save(profile);
                }
            }
        }
    }
}
