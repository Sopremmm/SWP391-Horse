package com.swp391.horseracing.dto.response;

public class RaceResultResponse {
    private Long entryId;
    private Long horseId;
    private String horseName;
    private Integer finishRank;
    private Long finishTimeMs;
    private Boolean disqualified;

    public Long getEntryId() { return entryId; }
    public void setEntryId(Long entryId) { this.entryId = entryId; }
    public Long getHorseId() { return horseId; }
    public void setHorseId(Long horseId) { this.horseId = horseId; }
    public String getHorseName() { return horseName; }
    public void setHorseName(String horseName) { this.horseName = horseName; }
    public Integer getFinishRank() { return finishRank; }
    public void setFinishRank(Integer finishRank) { this.finishRank = finishRank; }
    public Long getFinishTimeMs() { return finishTimeMs; }
    public void setFinishTimeMs(Long finishTimeMs) { this.finishTimeMs = finishTimeMs; }
    public Boolean getDisqualified() { return disqualified; }
    public void setDisqualified(Boolean disqualified) { this.disqualified = disqualified; }
}
