package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.response.BetResponse;
import com.swp391.horseracing.entity.Bet;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceEntry;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.BetRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BetService {
    @Autowired
    private BetRepository betRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    public BetResponse placeBet(Long spectatorId, Long raceId, Long predictedEntryId) {
        User spectator = userRepository.findById(spectatorId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        if (race.getStatus() == null || !"SCHEDULED".equalsIgnoreCase(race.getStatus())) {
            throw new RuntimeException("Error: Race is not open for betting (BET-01)");
        }

        if (betRepository.existsBySpectatorIdAndRaceId(spectatorId, raceId)) {
            throw new RuntimeException("Error: Only 1 prediction per race is allowed (BET-02)");
        }

        RaceEntry predictedEntry = raceEntryRepository.findById(predictedEntryId)
                .orElseThrow(() -> new RuntimeException("Error: Race entry not found!"));

        if (predictedEntry.getRace() == null || predictedEntry.getRace().getId() == null) {
            throw new RuntimeException("Error: Entry is not assigned to a race (BET-03)");
        }
        if (!predictedEntry.getRace().getId().equals(raceId)) {
            throw new RuntimeException("Error: Selected horse is not in this race (BET-04)");
        }

        Bet bet = Bet.builder()
                .spectator(spectator)
                .race(race)
                .predictedEntry(predictedEntry)
                .result("PENDING")
                .build();

        Bet saved = betRepository.save(bet);
        return toResponse(saved);
    }

    public List<BetResponse> getMyBets(Long spectatorId) {
        return betRepository.findBySpectatorIdOrderByPlacedAtDesc(spectatorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BetResponse toResponse(Bet bet) {
        BetResponse res = new BetResponse();
        res.setId(bet.getId());
        if (bet.getRace() != null) {
            res.setRaceId(bet.getRace().getId());
            res.setRaceName(bet.getRace().getName());
            res.setRaceStatus(bet.getRace().getStatus());
            res.setRaceDate(bet.getRace().getRaceDate());
        }
        if (bet.getPredictedEntry() != null) {
            res.setPredictedEntryId(bet.getPredictedEntry().getId());
            if (bet.getPredictedEntry().getHorse() != null) {
                res.setPredictedHorseId(bet.getPredictedEntry().getHorse().getId());
                res.setPredictedHorseName(bet.getPredictedEntry().getHorse().getName());
            }
        }
        res.setResult(bet.getResult());
        res.setPlacedAt(bet.getPlacedAt());
        res.setResolvedAt(bet.getResolvedAt());
        return res;
    }
}
