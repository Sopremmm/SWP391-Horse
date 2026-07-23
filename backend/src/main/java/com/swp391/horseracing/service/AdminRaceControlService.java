package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.request.AdminConfigureRaceGatesRequest;
import com.swp391.horseracing.dto.response.AdminRaceChecklistResponse;
import com.swp391.horseracing.dto.response.AdminRaceListItemResponse;
import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.enums.RaceStatus;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

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

    @Autowired
    private HorseRepository horseRepository;

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

    private void excludeEntriesWithoutJockey(Race race) {
        List<RaceEntry> entries = raceEntryRepository.findByRaceId(race.getId());
        for (RaceEntry entry : entries) {
            if ("APPROVED".equals(entry.getStatus()) || "CONFIRMED".equals(entry.getStatus())) {
                if (entry.getJockey() == null) {
                    entry.setStatus("WITHDRAWN");
                    entry.setNoShow(true);
                    entry.setNoShowAt(java.time.LocalDateTime.now());
                    raceEntryRepository.save(entry);
                }
            }
        }
    }

    @Transactional
    public Race forceStartRace(Long actorAdminId, Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
        
        RaceStatus current = RaceStatus.fromString(race.getStatus());
        if (current != RaceStatus.SCHEDULED) {
            throw new RuntimeException("Error: Only SCHEDULED race can be force started!");
        }

        AdminRaceChecklistResponse checklist = getChecklist(raceId);
        if (!checklist.isHasReferee()) {
            throw new RuntimeException("Error: Referee must be assigned before force starting!");
        }

        excludeEntriesWithoutJockey(race);

        race.setStatus(RaceStatus.ONGOING.name());
        return raceRepository.save(race);
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

    @Transactional
    public Race configureRaceGates(Long actorAdminId, Long raceId, AdminConfigureRaceGatesRequest request) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
        if (race.getTournament() == null || race.getTournament().getId() == null) {
            throw new RuntimeException("Error: Race tournament not found!");
        }

        int gateCount = request.getGateCount() == null ? 0 : request.getGateCount();
        if (gateCount < 1) {
            throw new RuntimeException("Error: Gate count must be at least 1!");
        }

        List<AdminConfigureRaceGatesRequest.GateAssignment> assignments =
                request.getAssignments() == null ? List.of() : request.getAssignments();

        Set<String> seenHorseKeys = new HashSet<>();
        Set<Integer> seenGateNumbers = new HashSet<>();
        Map<Long, RaceEntry> tournamentEntries = new HashMap<>();
        Map<Long, RaceEntry> tournamentEntriesByHorseId = new HashMap<>();
        for (RaceEntry entry : raceEntryRepository.findByTournamentId(race.getTournament().getId())) {
            if (entry != null && entry.getId() != null) {
                tournamentEntries.put(entry.getId(), entry);
                if (entry.getHorse() != null && entry.getHorse().getId() != null) {
                    RaceEntry previous = tournamentEntriesByHorseId.putIfAbsent(entry.getHorse().getId(), entry);
                    if (previous != null && !previous.getId().equals(entry.getId())) {
                        throw new RuntimeException("Error: Duplicate tournament entry found for horse #" + entry.getHorse().getId() + "!");
                    }
                }
            }
        }

        for (AdminConfigureRaceGatesRequest.GateAssignment assignment : assignments) {
            if (assignment == null || assignment.getGateNumber() == null) {
                throw new RuntimeException("Error: Invalid gate assignment!");
            }
            if (assignment.getGateNumber() < 1 || assignment.getGateNumber() > gateCount) {
                throw new RuntimeException("Error: Gate number is out of configured range!");
            }
            Long horseId = assignment.getHorseId();
            if (horseId == null && assignment.getEntryId() != null) {
                RaceEntry mappedEntry = tournamentEntries.get(assignment.getEntryId());
                horseId = mappedEntry != null && mappedEntry.getHorse() != null ? mappedEntry.getHorse().getId() : null;
            }
            if (horseId == null) {
                throw new RuntimeException("Error: Gate assignment must include an entry or horse!");
            }
            if (!seenHorseKeys.add("horse:" + horseId)) {
                throw new RuntimeException("Error: Duplicate horse in gate assignments!");
            }
            if (!seenGateNumbers.add(assignment.getGateNumber())) {
                throw new RuntimeException("Error: Duplicate gate number in gate assignments!");
            }

            if (assignment.getEntryId() != null) {
                RaceEntry entry = tournamentEntries.get(assignment.getEntryId());
                if (entry == null) {
                    throw new RuntimeException("Error: Race entry does not belong to this tournament!");
                }
                String status = entry.getStatus();
                if (status != null && status.equalsIgnoreCase("REJECTED")) {
                    throw new RuntimeException("Error: Rejected entries cannot be assigned to gates!");
                }
            } else {
                Horse horse = horseRepository.findById(horseId)
                        .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
                if (horse.getStatus() != null && horse.getStatus().equalsIgnoreCase("RETIRED")) {
                    throw new RuntimeException("Error: Retired horses cannot be assigned to gates!");
                }
                RaceEntry existingEntry = tournamentEntriesByHorseId.get(horseId);
                if (existingEntry != null) {
                    String status = existingEntry.getStatus();
                    if (status != null && status.equalsIgnoreCase("REJECTED")) {
                        throw new RuntimeException("Error: Rejected entries cannot be assigned to gates!");
                    }
                }
            }
        }

        List<RaceEntry> currentRaceEntries = raceEntryRepository.findByRaceId(raceId);
        Set<Long> selectedIds = new HashSet<>();
        for (RaceEntry entry : currentRaceEntries) {
            if (entry == null || entry.getId() == null) continue;
            if (!selectedIds.contains(entry.getId())) {
                entry.setGateNumber(null);
                entry.setRace(null);
                raceEntryRepository.save(entry);
            }
        }
        raceEntryRepository.flush();

        Set<Long> seenJockeyIds = new HashSet<>();
        for (AdminConfigureRaceGatesRequest.GateAssignment assignment : assignments) {
            RaceEntry entry = assignment.getEntryId() != null ? tournamentEntries.get(assignment.getEntryId()) : null;
            if (entry == null && assignment.getHorseId() != null) {
                entry = tournamentEntriesByHorseId.get(assignment.getHorseId());
                if (entry == null) {
                    Horse horse = horseRepository.findById(assignment.getHorseId())
                            .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
                    entry = new RaceEntry();
                    entry.setHorse(horse);
                    entry.setTournament(race.getTournament());
                    entry.setStatus("APPROVED");
                    entry.setApprovedAt(LocalDateTime.now());
                }
            }
            if (entry == null) {
                throw new RuntimeException("Error: Unable to resolve horse entry for gate assignment!");
            }
            // Bug 4 fix: Prevent the same jockey from being assigned to multiple gates in one race
            if (entry.getJockey() != null && entry.getJockey().getId() != null) {
                if (!seenJockeyIds.add(entry.getJockey().getId())) {
                    String jockeyName = entry.getJockey().getFullName() != null ? entry.getJockey().getFullName() : "#" + entry.getJockey().getId();
                    throw new RuntimeException("Error: Jockey \"" + jockeyName + "\" is already assigned to another gate in this race!");
                }
            }
            entry.setRace(race);
            entry.setGateNumber(assignment.getGateNumber());
            String status = entry.getStatus();
            if (status == null || status.equalsIgnoreCase("PENDING")) {
                entry.setStatus("APPROVED");
                if (entry.getApprovedAt() == null) {
                    entry.setApprovedAt(LocalDateTime.now());
                }
            }
            RaceEntry savedEntry = raceEntryRepository.save(entry);
            selectedIds.add(savedEntry.getId());
            if (savedEntry.getHorse() != null && savedEntry.getHorse().getId() != null) {
                tournamentEntriesByHorseId.put(savedEntry.getHorse().getId(), savedEntry);
            }
        }

        race.setMaxParticipants(gateCount);
        Race saved = raceRepository.save(race);
        auditLogService.log(actorAdminId, "ADMIN_CONFIGURE_RACE_GATES", "RACE", raceId, "gateCount=" + gateCount + ", assignments=" + assignments.size());
        return saved;
    }
}

