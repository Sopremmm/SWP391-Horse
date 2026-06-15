package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.PredictionRequest;
import com.swp391.horseracing.dto.PredictionResponse;
import com.swp391.horseracing.entity.*;
import com.swp391.horseracing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PredictionService {
    private final BetRepository betRepository;
    private final RaceRepository raceRepository;
    private final RaceEntryRepository raceEntryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // Task 21: Place prediction
    @Transactional
    public PredictionResponse placePrediction(Long spectatorId, PredictionRequest request) {
        // Rule: Race must exist
        Race race = raceRepository.findById(request.getRaceId())
                .orElseThrow(() -> new RuntimeException("Race not found"));

        // Rule PRD-01: Must predict before 30 minutes
        if (LocalDateTime.now().isAfter(race.getRaceDate().minusMinutes(30))) {
            throw new RuntimeException("Cannot place prediction: less than 30 minutes before race start");
        }

        // Rule PRD-02: Only one prediction per race
        if (betRepository.existsBySpectatorIdAndRaceId(spectatorId, request.getRaceId())) {
            throw new RuntimeException("You have already placed a prediction for this race");
        }

        // Rule: Race must be SCHEDULED
        if (race.getStatus() != Race.RaceStatus.SCHEDULED) {
            throw new RuntimeException("Can only predict on SCHEDULED races");
        }

        // Check entry exists
        RaceEntry entry = raceEntryRepository.findById(request.getPredictedEntryId())
                .orElseThrow(() -> new RuntimeException("Race entry not found"));

        if (!entry.getRace().getId().equals(race.getId())) {
            throw new RuntimeException("Entry does not belong to this race");
        }

        User spectator = userRepository.findById(spectatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Bet bet = Bet.builder()
                .spectator(spectator)
                .race(race)
                .predictedEntry(entry)
                .result(Bet.BetResult.PENDING)
                .placedAt(LocalDateTime.now())
                .build();

        Bet saved = betRepository.save(bet);

        // Tạo notification xác nhận
        notificationService.createNotification(
                spectatorId,
                "Prediction Placed",
                String.format("You have predicted for race '%s' - Horse: %s",
                        race.getName(), entry.getHorse().getName()),
                "PREDICTION_PLACED",
                saved.getId(),
                "Bet"
        );

        return PredictionResponse.fromEntity(saved, false);
    }

    // Task 28: View my predictions list
    public Page<PredictionResponse> getMyPredictions(Long spectatorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Bet> bets = betRepository.findBySpectatorId(spectatorId, pageable);
        return bets.map(bet -> PredictionResponse.fromEntity(bet, false));
    }

    // Get prediction by status (WIN/LOSE/PENDING)
    public List<PredictionResponse> getPredictionsByStatus(Long spectatorId, String status) {
        // Implement if needed
        return null;
    }
}