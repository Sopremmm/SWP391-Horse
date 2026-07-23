package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SaveTournamentBracketRequest {
    @NotNull @Min(0) @Max(64)
    private Integer qualifyingRaces;

    @NotNull @Min(0) @Max(32)
    private Integer semifinalRaces;

    public Integer getQualifyingRaces() { return qualifyingRaces; }
    public void setQualifyingRaces(Integer qualifyingRaces) { this.qualifyingRaces = qualifyingRaces; }
    public Integer getSemifinalRaces() { return semifinalRaces; }
    public void setSemifinalRaces(Integer semifinalRaces) { this.semifinalRaces = semifinalRaces; }
}
