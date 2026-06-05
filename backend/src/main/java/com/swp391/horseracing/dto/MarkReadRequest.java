package com.swp391.horseracing.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    private Boolean markAll = false;
}