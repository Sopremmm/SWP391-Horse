package com.swp391.horseracing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JockeyProfileRequest {
    @NotBlank
    private String licenseNumber;

    @NotNull
    private BigDecimal weightKg;

    @NotNull
    private Integer experienceYears;

    private String bio;
}