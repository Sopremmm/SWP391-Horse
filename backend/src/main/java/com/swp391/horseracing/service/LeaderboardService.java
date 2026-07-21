package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.LeaderboardRowResponse;
import com.swp391.horseracing.entity.Prize;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.repository.PrizeRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class LeaderboardService {
    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private PrizeRepository prizeRepository;

    public List<LeaderboardRowResponse> getTournamentLeaderboard(Long tournamentId) {
        List<RaceResult> results = raceResultRepository.findByRaceTournamentId(tournamentId);
        List<Prize> prizes = prizeRepository.findByRaceTournamentId(tournamentId);

        Map<Long, MutableRow> rows = new HashMap<>();
        for (RaceResult rr : results) {
            if (rr.getRace() == null || rr.getRace().getStatus() == null || !"COMPLETED".equalsIgnoreCase(rr.getRace().getStatus())) {
                continue;
            }
            if (rr.getEntry() == null || rr.getEntry().getId() == null) {
                continue;
            }
            Long entryId = rr.getEntry().getId();
            MutableRow row = rows.computeIfAbsent(entryId, id -> new MutableRow(rr));
            row.races++;
            if (rr.getFinishRank() != null) {
                if (rr.getFinishRank() == 1) {
                    row.points += 3;
                    row.wins += 1;
                } else if (rr.getFinishRank() == 2) {
                    row.points += 2;
                } else if (rr.getFinishRank() == 3) {
                    row.points += 1;
                }
            }
        }

        Map<Long, BigDecimal> totalPrizeByEntryId = new HashMap<>();
        for (Prize p : prizes) {
            if (p.getEntry() == null || p.getEntry().getId() == null) {
                continue;
            }
            BigDecimal amount = p.getAmount() == null ? BigDecimal.ZERO : p.getAmount();
            totalPrizeByEntryId.merge(p.getEntry().getId(), amount, BigDecimal::add);
        }
        for (MutableRow row : rows.values()) {
            row.totalPrize = totalPrizeByEntryId.getOrDefault(row.entryId, BigDecimal.ZERO);
        }

        return rows.values().stream()
                .sorted(Comparator
                        .comparing(MutableRow::getPoints).reversed()
                        .thenComparing(MutableRow::getTotalPrize).reversed()
                        .thenComparing(MutableRow::getHorseName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(MutableRow::toResponse)
                .toList();
    }

    private static class MutableRow {
        private final Long entryId;
        private final Long horseId;
        private final String horseName;
        private int points = 0;
        private int wins = 0;
        private int races = 0;
        private BigDecimal totalPrize = BigDecimal.ZERO;

        private MutableRow(RaceResult rr) {
            this.entryId = rr.getEntry().getId();
            this.horseId = rr.getEntry().getHorse() == null ? null : rr.getEntry().getHorse().getId();
            this.horseName = rr.getEntry().getHorse() == null ? null : rr.getEntry().getHorse().getName();
        }

        private Integer getPoints() { return points; }
        private BigDecimal getTotalPrize() { return totalPrize == null ? BigDecimal.ZERO : totalPrize; }
        private String getHorseName() { return horseName; }

        private LeaderboardRowResponse toResponse() {
            LeaderboardRowResponse res = new LeaderboardRowResponse();
            res.setEntryId(entryId);
            res.setHorseId(horseId);
            res.setHorseName(horseName);
            res.setPoints(points);
            res.setWins(wins);
            res.setRaces(races);
            res.setTotalPrize(getTotalPrize());
            return res;
        }
    }
}
