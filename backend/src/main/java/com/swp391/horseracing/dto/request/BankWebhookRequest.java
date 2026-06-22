package com.swp391.horseracing.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BankWebhookRequest {
    @NotBlank
    private String reference;

    @NotBlank
    private String status;

    @NotNull
    @DecimalMin("0.01")
    @Digits(integer = 13, fraction = 2)
    private BigDecimal amount;

    private String bankTxnId;

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getBankTxnId() { return bankTxnId; }
    public void setBankTxnId(String bankTxnId) { this.bankTxnId = bankTxnId; }
}

