package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Bet;
import com.swp391.horseracing.entity.Race;
import com.swp391.horseracing.entity.RaceResult;
import com.swp391.horseracing.repository.BetRepository;
import com.swp391.horseracing.repository.RaceRepository;
import com.swp391.horseracing.repository.RaceResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResultMatchingService {
    @Autowired
    private RaceRepository raceRepository;

    @Autowired
    private RaceResultRepository raceResultRepository;

    @Autowired
    private BetRepository betRepository;

    @Autowired
    private NotificationService notificationService;

    public void resolveBetsForRace(Long raceId) {
        Race race = raceRepository.findById(raceId)
                .orElseThrow(() -> new RuntimeException("Error: Race not found!"));

        RaceResult winner = raceResultRepository.findFirstByRaceIdAndFinishRank(raceId, 1)
                .orElseThrow(() -> new RuntimeException("Error: Winner (rank 1) not found!"));

        List<Bet> bets = betRepository.findByRaceId(raceId);
        if (bets == null || bets.isEmpty()) {
            return;
        }

        String winnerHorseName = winner.getEntry() != null && winner.getEntry().getHorse() != null
                ? winner.getEntry().getHorse().getName()
                : "";

        LocalDateTime now = LocalDateTime.now();
        for (Bet bet : bets) {
            if (bet.getSpectator() == null || bet.getSpectator().getId() == null) {
                continue;
            }
            if (bet.getResult() != null && !"PENDING".equalsIgnoreCase(bet.getResult())) {
                continue;
            }

            boolean win = bet.getPredictedEntry() != null
                    && bet.getPredictedEntry().getId() != null
                    && bet.getPredictedEntry().getId().equals(winner.getEntry().getId());

            bet.setResult(win ? "WIN" : "LOSE");
            bet.setResolvedAt(now);
            betRepository.save(bet);

            String type = win ? "BET_WIN" : "BET_LOSE";
            String title = win ? "Bet Won" : "Bet Lost";
            String message = "Race \"" + race.getName() + "\" is published. Winner: \"" + winnerHorseName + "\". Your bet: " + (win ? "WIN" : "LOSE") + ".";
            notificationService.sendNotification(
                    bet.getSpectator().getId(),
                    title,
                    message,
                    type,
                    race.getId(),
                    "RACE"
            );
        }
    }
}
