package com.swp391.horseracing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorseRequest {
    @NotBlank
    private String name;

    private String breed;

    @NotNull
    private Integer age;

    @NotNull
    private BigDecimal weightKg;

    private String color;

    private String imageUrl;
}