package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RefereeService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    public List<RaceEntry> getRaceEntriesForReferee(Long raceId, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        return raceEntryRepository.findByRaceId(race.getId());
    }

    public List<RaceResult> getRaceResultsForReferee(Long raceId, Long refereeUserId) {
        getRaceAndAuthorizeReferee(raceId, refereeUserId);
        return raceResultRepository.findByRaceId(raceId);
    }

    public RefereeReport getReportForReferee(Long raceId, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        return getOrCreateReport(race);
    }

    public RaceEntry checkInEntry(Long raceId, Long entryId, boolean checkedIn, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        if (entry.getRace() == null || entry.getRace().getId() == null || !entry.getRace().getId().equals(raceId)) {
            throw new RuntimeException("Error: Entry does not belong to this race!");
        }
        if (checkedIn) {
            if (entry.getStatus() == null || !(entry.getStatus().equals("APPROVED") || entry.getStatus().equals("CONFIRMED"))) {
                throw new RuntimeException("Error: Only approved entries can be checked-in!");
            }
            if (entry.getJockey() == null || entry.getJockey().getId() == null) {
                throw new RuntimeException("Error: Jockey must be assigned before check-in!");
            }
        }

        entry.setCheckedIn(checkedIn);
        entry.setCheckedInAt(checkedIn ? LocalDateTime.now() : null);
        if (checkedIn) {
            entry.setNoShow(false);
            entry.setNoShowAt(null);
        }
        return raceEntryRepository.save(entry);
    }

    public RaceEntry markNoShow(Long raceId, Long entryId, String reason, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        if (entry.getRace() == null || entry.getRace().getId() == null || !entry.getRace().getId().equals(raceId)) {
            throw new RuntimeException("Error: Entry does not belong to this race!");
        }
        if (entry.getStatus() == null || !(entry.getStatus().equals("APPROVED") || entry.getStatus().equals("CONFIRMED"))) {
            throw new RuntimeException("Error: Only approved entries can be marked as no-show!");
        }

        entry.setNoShow(true);
        entry.setNoShowAt(LocalDateTime.now());
        entry.setCheckedIn(false);
        entry.setCheckedInAt(null);
        entry.setStatus("WITHDRAWN");
        raceEntryRepository.save(entry);

        appendViolationLine(report, "NO_SHOW", entryId, reason);
        refereeReportRepository.save(report);

        return entry;
    }

    public RefereeReport recordViolation(Long raceId, Long entryId, String message, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        RaceEntry entry = raceEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Error: Entry not found!"));
        if (entry.getRace() == null || entry.getRace().getId() == null || !entry.getRace().getId().equals(raceId)) {
            throw new RuntimeException("Error: Entry does not belong to this race!");
        }

        appendViolationLine(report, "VIOLATION", entryId, message);
        return refereeReportRepository.save(report);
    }

    public List<RaceResult> upsertResults(Long raceId, List<ResultInput> results, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        if (results == null || results.isEmpty()) {
            throw new RuntimeException("Error: Results payload is empty!");
        }

        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        Map<Long, RaceEntry> entryById = entries.stream()
                .filter(e -> e.getId() != null)
                .collect(Collectors.toMap(RaceEntry::getId, e -> e));

        for (ResultInput input : results) {
            if (input == null || input.entryId() == null) {
                throw new RuntimeException("Error: entryId is required!");
            }
            RaceEntry entry = entryById.get(input.entryId());
            if (entry == null) {
                throw new RuntimeException("Error: Entry does not belong to this race!");
            }
            if (input.finishRank() == null || input.finishRank() <= 0) {
                throw new RuntimeException("Error: finishRank must be positive!");
            }
            if (input.finishTimeMs() != null && input.finishTimeMs() <= 0) {
                throw new RuntimeException("Error: finishTimeMs must be positive!");
            }
        }

        ensureAllCheckedInOrWithdrawn(entries);

        List<RaceResult> existing = raceResultRepository.findByRaceId(raceId);
        Map<Long, RaceResult> resultByEntryId = existing.stream()
                .filter(r -> r.getEntry() != null && r.getEntry().getId() != null)
                .collect(Collectors.toMap(r -> r.getEntry().getId(), r -> r));

        Set<Long> targetEntryIds = results.stream()
                .map(ResultInput::entryId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        int tempRank = -1;
        for (RaceResult rr : existing) {
            Long entryId = rr.getEntry() == null ? null : rr.getEntry().getId();
            if (entryId != null && targetEntryIds.contains(entryId)) {
                rr.setFinishRank(tempRank--);
                raceResultRepository.save(rr);
            }
        }

        Map<Integer, Long> rankToEntryId = new HashMap<>();
        for (RaceResult r : existing) {
            if (r.getFinishRank() != null && r.getEntry() != null && r.getEntry().getId() != null) {
                rankToEntryId.put(r.getFinishRank(), r.getEntry().getId());
            }
        }

        for (ResultInput input : results) {
            Long entryId = input.entryId();
            Integer rank = input.finishRank();
            Long occupiedBy = rankToEntryId.get(rank);
            if (occupiedBy != null && !occupiedBy.equals(entryId)) {
                throw new RuntimeException("Error: Duplicate finishRank in this race!");
            }
            rankToEntryId.put(rank, entryId);
        }

        List<RaceResult> saved = new ArrayList<>();
        for (ResultInput input : results) {
            RaceEntry entry = entryById.get(input.entryId());
            RaceResult rr = resultByEntryId.get(entry.getId());
            if (rr == null) {
                rr = RaceResult.builder()
                        .race(race)
                        .entry(entry)
                        .finishRank(input.finishRank())
                        .finishTimeMs(input.finishTimeMs())
                        .build();
            } else {
                rr.setFinishRank(input.finishRank());
                rr.setFinishTimeMs(input.finishTimeMs());
            }
            saved.add(raceResultRepository.save(rr));
        }

        return saved;
    }

    public RefereeReport saveDraftReport(Long raceId, String notes, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);
        report.setNotes(notes);
        return refereeReportRepository.save(report);
    }

    public RefereeReport submitReport(Long raceId, String notes, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        if (notes != null) {
            report.setNotes(notes);
        }

        List<RaceEntry> entries = raceEntryRepository.findByRaceId(raceId);
        ensureAllCheckedInOrWithdrawn(entries);

        report.setSubmitted(true);
        report.setSubmittedAt(LocalDateTime.now());
        refereeReportRepository.save(report);

        if (!"COMPLETED".equalsIgnoreCase(race.getStatus())) {
            race.setStatus("FINISHED");
            raceRepository.save(race);
        }

        return report;
    }

    public RefereeReport confirmReport(Long raceId, Long refereeUserId) {
        Race race = getRaceAndAuthorizeReferee(raceId, refereeUserId);
        RefereeReport report = getOrCreateReport(race);
        ensureNotConfirmed(report);

        if (report.getSubmitted() == null || !report.getSubmitted()) {
            throw new RuntimeException("Error: Report must be submitted before confirmation!");
        }

        LocalDateTime deadline = race.getRaceDate().plusHours(2);
        if (LocalDateTime.now().isAfter(deadline)) {
            throw new RuntimeException("Error: Confirmation deadline passed (RS-01)");
        }

        report.setConfirmed(true);
        report.setConfirmedAt(LocalDateTime.now());
        refereeReportRepository.save(report);

        race.setStatus("COMPLETED");
        raceRepository.save(race);

        return report;
    }

    public record ResultInput(Long entryId, Integer finishRank, Long finishTimeMs) {}

    private Race getRaceAndAuthorizeReferee(Long raceId, Long refereeUserId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        if (race.getReferee() == null || race.getReferee().getId() == null) {
            throw new RuntimeException("Error: Referee not assigned to this race!");
        }
        if (!race.getReferee().getId().equals(refereeUserId)) {
            throw new RuntimeException("Error: You are not assigned as referee for this race!");
        }
        return race;
    }

    private RefereeReport getOrCreateReport(Race race) {
        return refereeReportRepository.findByRaceId(race.getId())
                .orElseGet(() -> refereeReportRepository.save(RefereeReport.builder()
                        .race(race)
                        .referee(race.getReferee())
                        .violations("")
                        .notes("")
                        .submitted(false)
                        .confirmed(false)
                        .build()));
    }

    private void ensureNotConfirmed(RefereeReport report) {
        if (report.getConfirmed() != null && report.getConfirmed()) {
            throw new RuntimeException("Error: Published results cannot be modified (RS-02)");
        }
    }

    private void ensureAllCheckedInOrWithdrawn(List<RaceEntry> entries) {
        boolean anyMissing = entries.stream()
                .filter(e -> e.getStatus() != null && (e.getStatus().equals("APPROVED") || e.getStatus().equals("CONFIRMED")))
                .anyMatch(e -> e.getCheckedIn() == null || !e.getCheckedIn());
        if (anyMissing) {
            throw new RuntimeException("Error: All horses must be checked-in before race processing (RD-03)");
        }
    }

    private void appendViolationLine(RefereeReport report, String type, Long entryId, String message) {
        String line = LocalDateTime.now() + " | " + type + " | entryId=" + entryId + " | " + (message == null ? "" : message);
        String existing = report.getViolations() == null ? "" : report.getViolations().trim();
        if (existing.isEmpty()) {
            report.setViolations(line);
        } else {
            report.setViolations(existing + "\n" + line);
        }
    }
}
