package com.swp391.horseracing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    @NotNull
    private Long raceId;

    @NotNull
    private Long predictedEntryId;
}