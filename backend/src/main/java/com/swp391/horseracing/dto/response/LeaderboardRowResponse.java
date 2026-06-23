package com.swp391.horseracing.dto.response;

import java.math.BigDecimal;

public class LeaderboardRowResponse {
    private Long entryId;
    private Long horseId;
    private String horseName;
    private Integer points;
    private Integer wins;
    private Integer races;
    private BigDecimal totalPrize;

    public Long getEntryId() { return entryId; }
    public void setEntryId(Long entryId) { this.entryId = entryId; }
    public Long getHorseId() { return horseId; }
    public void setHorseId(Long horseId) { this.horseId = horseId; }
    public String getHorseName() { return horseName; }
    public void setHorseName(String horseName) { this.horseName = horseName; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
    public Integer getWins() { return wins; }
    public void setWins(Integer wins) { this.wins = wins; }
    public Integer getRaces() { return races; }
    public void setRaces(Integer races) { this.races = races; }
    public BigDecimal getTotalPrize() { return totalPrize; }
    public void setTotalPrize(BigDecimal totalPrize) { this.totalPrize = totalPrize; }
}
