package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.RaceResultResponse;
import com.swp391.horseracing.dto.response.PublicRaceResultsResponse;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.entity.RefereeReport;
import com.swp391.horseracing.repository.RaceResultRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RefereeReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
public class RaceResultQueryService {
    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RefereeReportRepository refereeReportRepository;

    public PublicRaceResultsResponse getPublicRaceResults(Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));
        if (!"COMPLETED".equalsIgnoreCase(race.getStatus())) {
            throw new AccessDeniedException("Results are not published");
        }

        List<RaceResultResponse> results = raceResultRepository.findByRaceIdOrderByFinishRankAsc(raceId)
                .stream()
                .map(this::toResponse)
                .toList();

        RefereeReport report = refereeReportRepository.findByRaceId(raceId).orElse(null);

        PublicRaceResultsResponse response = new PublicRaceResultsResponse();
        response.setResults(results);
        response.setViolations(report == null ? null : report.getViolations());
        response.setNotes(report == null ? null : report.getNotes());
        return response;
    }

    private RaceResultResponse toResponse(RaceResult rr) {
        RaceResultResponse res = new RaceResultResponse();
        res.setFinishRank(rr.getFinishRank());
        res.setFinishTimeMs(rr.getFinishTimeMs());
        res.setDisqualified(rr.getDisqualified());
        if (rr.getEntry() != null) {
            res.setEntryId(rr.getEntry().getId());
            if (rr.getEntry().getHorse() != null) {
                res.setHorseId(rr.getEntry().getHorse().getId());
                res.setHorseName(rr.getEntry().getHorse().getName());
            }
        }
        return res;
    }
}
