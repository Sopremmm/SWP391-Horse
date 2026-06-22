package com.swp391.horseracing.dto.response;

import java.math.BigDecimal;

public class PrizeResponse {
    private Integer finishRank;
    private Long entryId;
    private Long horseId;
    private String horseName;
    private BigDecimal amount;

    public Integer getFinishRank() { return finishRank; }
    public void setFinishRank(Integer finishRank) { this.finishRank = finishRank; }
    public Long getEntryId() { return entryId; }
    public void setEntryId(Long entryId) { this.entryId = entryId; }
    public Long getHorseId() { return horseId; }
    public void setHorseId(Long horseId) { this.horseId = horseId; }
    public String getHorseName() { return horseName; }
    public void setHorseName(String horseName) { this.horseName = horseName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
