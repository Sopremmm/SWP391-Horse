package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.AdminRaceChecklistResponse;
import com.swp391.horseracing.dto.response.AdminRaceListItemResponse;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.enums.RaceStatus;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class AdminRaceControlService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<AdminRaceListItemResponse> listRaces(Long tournamentId, String status, String q, LocalDateTime from, LocalDateTime to) {
        List<Race> races = tournamentId != null ? raceRepository.findByTournamentId(tournamentId) : raceRepository.findAll();

        String qNorm = q == null ? null : q.trim().toLowerCase(Locale.ROOT);
        RaceStatus statusFilter = RaceStatus.fromString(status);

        List<AdminRaceListItemResponse> out = new ArrayList<>();
        for (Race race : races) {
            if (race == null || race.getId() == null) continue;

            if (statusFilter != null) {
                RaceStatus current = RaceStatus.fromString(race.getStatus());
                if (current == null || current != statusFilter) continue;
            }

            if (qNorm != null && !qNorm.isBlank()) {
                String hay = (race.getName() == null ? "" : race.getName()).toLowerCase(Locale.ROOT);
                String tour = (race.getTournament() != null && race.getTournament().getName() != null ? race.getTournament().getName() : "").toLowerCase(Locale.ROOT);
                if (!hay.contains(qNorm) && !tour.contains(qNorm) && !String.valueOf(race.getId()).contains(qNorm)) {
                    continue;
                }
            }

            if (from != null && race.getRaceDate() != null && race.getRaceDate().isBefore(from)) continue;
            if (to != null && race.getRaceDate() != null && race.getRaceDate().isAfter(to)) continue;

            AdminRaceListItemResponse item = new AdminRaceListItemResponse();
            item.setId(race.getId());
            item.setName(race.getName());
            item.setRoundNumber(race.getRoundNumber());
            item.setRaceDate(race.getRaceDate());
            item.setDistanceM(race.getDistanceM());
            item.setStatus(race.getStatus());
            if (race.getTournament() != null) {
                item.setTournamentId(race.getTournament().getId());
                item.setTournamentName(race.getTournament().getName());
            }
            if (race.getReferee() != null) {
                item.setRefereeId(race.getReferee().getId());
                item.setRefereeName(race.getReferee().getFullName());
            }
            item.setChecklist(getChecklist(race.getId()));
            out.add(item);
        }
        out.sort((a, b) -> {
            LocalDateTime da = a.getRaceDate();
            LocalDateTime db = b.getRaceDate();
            if (da == null && db == null) return 0;
            if (da == null) return 1;
            if (db == null) return -1;
            return db.compareTo(da);
        });
        return out;
    }

    public AdminRaceChecklistResponse getChecklist(Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        List<RaceResult> results = raceResultRepository.findByRaceId(raceId);
        RefereeReport report = refereeReportRepository.findByRaceId(raceId).orElse(null);

        int approved = 0;
        int approvedWithJockey = 0;
        int checkedInOrNoShowOrWithdrawn = 0;
        for (RaceEntry e : entries) {
            String st = e.getStatus();
            boolean isApproved = st != null && (st.equalsIgnoreCase("APPROVED") || st.equalsIgnoreCase("CONFIRMED"));
            if (isApproved) {
                approved++;
                if (e.getJockey() != null && e.getJockey().getId() != null) {
                    approvedWithJockey++;
                }
                if (Boolean.TRUE.equals(e.getCheckedIn()) || Boolean.TRUE.equals(e.getNoShow())) {
                    checkedInOrNoShowOrWithdrawn++;
                }
            }
            if (st != null && st.equalsIgnoreCase("WITHDRAWN")) {
                checkedInOrNoShowOrWithdrawn++;
            }
        }

        AdminRaceChecklistResponse res = new AdminRaceChecklistResponse();
        res.setHasReferee(race.getReferee() != null && race.getReferee().getId() != null);
        res.setApprovedEntries(approved);
        res.setApprovedWithJockey(approvedWithJockey);
        res.setCheckedInOrNoShowOrWithdrawn(checkedInOrNoShowOrWithdrawn);
        res.setResultsRecorded(results == null ? 0 : results.size());
        res.setReportSubmitted(report != null && Boolean.TRUE.equals(report.getSubmitted()));
        res.setReportConfirmed(report != null && Boolean.TRUE.equals(report.getConfirmed()));
        return res;
    }

    @Transactional
    public Race updateRaceStatus(Long actorAdminId, Long raceId, String status) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        RaceStatus current = RaceStatus.fromString(race.getStatus());
        RaceStatus desired = RaceStatus.fromString(status);
        if (desired == null) {
            throw new RuntimeException("Error: Invalid status!");
        }
        if (desired == RaceStatus.COMPLETED) {
            throw new RuntimeException("Error: Use publish results to set COMPLETED!");
        }

        if (desired == RaceStatus.ONGOING) {
            if (current != RaceStatus.SCHEDULED) {
                throw new RuntimeException("Error: Only SCHEDULED race can be started!");
            }
            AdminRaceChecklistResponse checklist = getChecklist(raceId);
            if (!checklist.isHasReferee()) {
                throw new RuntimeException("Error: Referee must be assigned before starting!");
            }
            if (checklist.getApprovedEntries() < 2) {
                throw new RuntimeException("Error: Need at least 2 approved entries to start!");
            }
            if (checklist.getApprovedWithJockey() < checklist.getApprovedEntries()) {
                throw new RuntimeException("Error: All approved entries must have a jockey assigned!");
            }
            race.setStatus(RaceStatus.ONGOING.name());
        } else if (desired == RaceStatus.SCHEDULED) {
            if (current == RaceStatus.FINISHED || current == RaceStatus.COMPLETED) {
                throw new RuntimeException("Error: Cannot revert FINISHED/COMPLETED race!");
            }
            race.setStatus(RaceStatus.SCHEDULED.name());
        } else if (desired == RaceStatus.FINISHED) {
            AdminRaceChecklistResponse checklist = getChecklist(raceId);
            if (!checklist.isReportSubmitted()) {
                throw new RuntimeException("Error: Referee report must be submitted before FINISHED!");
            }
            race.setStatus(RaceStatus.FINISHED.name());
        }

        Race saved = raceRepository.save(race);
        auditLogService.log(actorAdminId, "ADMIN_UPDATE_RACE_STATUS", "RACE", raceId, "status=" + saved.getStatus());
        return saved;
    }
}

