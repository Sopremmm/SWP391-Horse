package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.PrizeResponse;
import com.swp391.horseracing.entity.Prize;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.repository.PrizeRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class PrizeService {
    private static final BigDecimal RANK1_PCT = new BigDecimal("0.50");
    private static final BigDecimal RANK2_PCT = new BigDecimal("0.30");
    private static final BigDecimal RANK3_PCT = new BigDecimal("0.20");

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private PrizeRepository prizeRepository;

    public List<PrizeResponse> calculateTop3ForRace(Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        BigDecimal prizePool = race.getTournament() != null && race.getTournament().getPrizePool() != null
                ? race.getTournament().getPrizePool()
                : BigDecimal.ZERO;

        upsertPrize(race, 1, prizePool.multiply(RANK1_PCT));
        upsertPrize(race, 2, prizePool.multiply(RANK2_PCT));
        upsertPrize(race, 3, prizePool.multiply(RANK3_PCT));

        return getPrizesByRace(raceId);
    }

    public List<PrizeResponse> getPrizesByRace(Long raceId) {
        return prizeRepository.findByRaceIdOrderByFinishRankAsc(raceId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void upsertPrize(Race race, int rank, BigDecimal amountRaw) {
        RaceResult result = raceResultRepository.findFirstByRaceIdAndFinishRank(race.getId(), rank).orElse(null);
        if (result == null || result.getEntry() == null || result.getEntry().getId() == null) {
            return;
        }
        RaceEntry entry = result.getEntry();

        BigDecimal amount = (amountRaw == null ? BigDecimal.ZERO : amountRaw).setScale(2, RoundingMode.HALF_UP);
        Optional<Prize> existing = prizeRepository.findByRaceIdAndEntryId(race.getId(), entry.getId());
        Prize prize = existing.orElseGet(() -> Prize.builder()
                .race(race)
                .entry(entry)
                .build());

        prize.setFinishRank(rank);
        prize.setAmount(amount);
        prizeRepository.save(prize);
    }

    private PrizeResponse toResponse(Prize prize) {
        PrizeResponse res = new PrizeResponse();
        res.setFinishRank(prize.getFinishRank());
        if (prize.getEntry() != null) {
            res.setEntryId(prize.getEntry().getId());
            if (prize.getEntry().getHorse() != null) {
                res.setHorseId(prize.getEntry().getHorse().getId());
                res.setHorseName(prize.getEntry().getHorse().getName());
            }
        }
        res.setAmount(prize.getAmount());
        return res;
    }
}
