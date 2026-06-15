package com.swp391.horseracing.dto;

import com.swp391.horseracing.entity.Bet;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private Long id;
    private Long raceId;
    private String raceName;
    private String horseName;
    private String jockeyName;
    private String result;
    private LocalDateTime placedAt;
    private Boolean isWin;

    public static PredictionResponse fromEntity(Bet bet, Boolean isWin) {
        PredictionResponse res = new PredictionResponse();
        res.setId(bet.getId());
        res.setRaceId(bet.getRace().getId());
        res.setRaceName(bet.getRace().getName());
        res.setHorseName(bet.getPredictedEntry().getHorse().getName());
        if (bet.getPredictedEntry().getJockey() != null) {
            res.setJockeyName(bet.getPredictedEntry().getJockey().getFullName());
        }
        res.setResult(bet.getResult().name());
        res.setPlacedAt(bet.getPlacedAt());
        res.setIsWin(isWin);
        return res;
    }
}