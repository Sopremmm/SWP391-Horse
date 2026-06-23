package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AdminUpdateRaceStatusRequest {
    @NotBlank
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

