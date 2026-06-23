package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.NotNull;

public class PlaceBetRequest {
    @NotNull
    private Long predictedEntryId;

    public Long getPredictedEntryId() {
        return predictedEntryId;
    }

    public void setPredictedEntryId(Long predictedEntryId) {
        this.predictedEntryId = predictedEntryId;
    }
}
