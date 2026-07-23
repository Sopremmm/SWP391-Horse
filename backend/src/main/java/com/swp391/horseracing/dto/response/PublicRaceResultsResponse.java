package com.swp391.horseracing.dto.response;

import java.util.List;

public class PublicRaceResultsResponse {
    private List<RaceResultResponse> results;
    private String violations;
    private String notes;

    public List<RaceResultResponse> getResults() { return results; }
    public void setResults(List<RaceResultResponse> results) { this.results = results; }

    public String getViolations() { return violations; }
    public void setViolations(String violations) { this.violations = violations; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
