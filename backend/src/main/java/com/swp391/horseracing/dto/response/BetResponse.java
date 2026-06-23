package com.swp391.horseracing.dto.response;

import java.time.LocalDateTime;

public class BetResponse {
    private Long id;
    private Long raceId;
    private String raceName;
    private String raceStatus;
    private LocalDateTime raceDate;
    private Long predictedEntryId;
    private Long predictedHorseId;
    private String predictedHorseName;
    private String result;
    private LocalDateTime placedAt;
    private LocalDateTime resolvedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getRaceId() { return raceId; }
    public void setRaceId(Long raceId) { this.raceId = raceId; }
    public String getRaceName() { return raceName; }
    public void setRaceName(String raceName) { this.raceName = raceName; }
    public String getRaceStatus() { return raceStatus; }
    public void setRaceStatus(String raceStatus) { this.raceStatus = raceStatus; }
    public LocalDateTime getRaceDate() { return raceDate; }
    public void setRaceDate(LocalDateTime raceDate) { this.raceDate = raceDate; }
    public Long getPredictedEntryId() { return predictedEntryId; }
    public void setPredictedEntryId(Long predictedEntryId) { this.predictedEntryId = predictedEntryId; }
    public Long getPredictedHorseId() { return predictedHorseId; }
    public void setPredictedHorseId(Long predictedHorseId) { this.predictedHorseId = predictedHorseId; }
    public String getPredictedHorseName() { return predictedHorseName; }
    public void setPredictedHorseName(String predictedHorseName) { this.predictedHorseName = predictedHorseName; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public LocalDateTime getPlacedAt() { return placedAt; }
    public void setPlacedAt(LocalDateTime placedAt) { this.placedAt = placedAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
