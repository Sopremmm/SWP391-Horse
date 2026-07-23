package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateTournamentRequest {
    @NotBlank
    private String name;
    private String location;
    private String description;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    @NotNull
    private LocalDate registrationStartDate;
    @NotNull
    private LocalDate registrationEndDate;
    private BigDecimal prizePool;
    @Min(1)
    private Integer maxHorses;
    private String imageUrl;
}
