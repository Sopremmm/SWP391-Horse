package com.swp391.horseracing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvitationRequest {
    @NotNull
    private Long horseId;

    @NotNull
    private Long jockeyId;

    @NotNull
    private Long raceId;

    private String message;
}