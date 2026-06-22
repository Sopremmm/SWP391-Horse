package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.RaceResultResponse;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.repository.RaceResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RaceResultQueryService {
    @Autowired
    private RaceResultRepository raceResultRepository;

    public List<RaceResultResponse> getRaceResults(Long raceId) {
        return raceResultRepository.findByRaceIdOrderByFinishRankAsc(raceId)
                .stream()
                .map(this::toResponse)
                .toList();
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
