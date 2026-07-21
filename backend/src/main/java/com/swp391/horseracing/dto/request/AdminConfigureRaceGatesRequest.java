package com.swp391.horseracing.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class AdminConfigureRaceGatesRequest {
    @NotNull
    @Min(1)
    private Integer gateCount;

    @Valid
    private List<GateAssignment> assignments = new ArrayList<>();

    public Integer getGateCount() {
        return gateCount;
    }

    public void setGateCount(Integer gateCount) {
        this.gateCount = gateCount;
    }

    public List<GateAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<GateAssignment> assignments) {
        this.assignments = assignments;
    }

    public static class GateAssignment {
        private Long entryId;

        private Long horseId;

        @NotNull
        @Min(1)
        private Integer gateNumber;

        public Long getEntryId() {
            return entryId;
        }

        public void setEntryId(Long entryId) {
            this.entryId = entryId;
        }

        public Long getHorseId() {
            return horseId;
        }

        public void setHorseId(Long horseId) {
            this.horseId = horseId;
        }

        public Integer getGateNumber() {
            return gateNumber;
        }

        public void setGateNumber(Integer gateNumber) {
            this.gateNumber = gateNumber;
        }
    }
}
