package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "race_result", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"race_id", "finish_rank"}),
    @UniqueConstraint(columnNames = {"race_id", "entry_id"})
})
public class RaceResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @OneToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private RaceEntry entry;

    @Column(name = "finish_rank", nullable = false)
    private Integer finishRank;

    @Column(name = "finish_time_ms")
    private Long finishTimeMs;

    private Boolean disqualified = false;

    @Lob
    @Column(name = "violation_notes")
    private String violationNotes;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    public RaceResult() {}

    public RaceResult(Long id, Race race, RaceEntry entry, Integer finishRank, Long finishTimeMs, Boolean disqualified, String violationNotes, LocalDateTime recordedAt) {
        this.id = id;
        this.race = race;
        this.entry = entry;
        this.finishRank = finishRank;
        this.finishTimeMs = finishTimeMs;
        this.disqualified = disqualified;
        this.violationNotes = violationNotes;
        this.recordedAt = recordedAt;
    }

    public static RaceResultBuilder builder() {
        return new RaceResultBuilder();
    }

    public static class RaceResultBuilder {
        private Long id;
        private Race race;
        private RaceEntry entry;
        private Integer finishRank;
        private Long finishTimeMs;
        private Boolean disqualified = false;
        private String violationNotes;
        private LocalDateTime recordedAt;

        public RaceResultBuilder id(Long id) { this.id = id; return this; }
        public RaceResultBuilder race(Race race) { this.race = race; return this; }
        public RaceResultBuilder entry(RaceEntry entry) { this.entry = entry; return this; }
        public RaceResultBuilder finishRank(Integer finishRank) { this.finishRank = finishRank; return this; }
        public RaceResultBuilder finishTimeMs(Long finishTimeMs) { this.finishTimeMs = finishTimeMs; return this; }
        public RaceResultBuilder disqualified(Boolean disqualified) { this.disqualified = disqualified; return this; }
        public RaceResultBuilder violationNotes(String violationNotes) { this.violationNotes = violationNotes; return this; }
        public RaceResultBuilder recordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; return this; }

        public RaceResult build() {
            return new RaceResult(id, race, entry, finishRank, finishTimeMs, disqualified, violationNotes, recordedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Race getRace() { return race; }
    public void setRace(Race race) { this.race = race; }
    public RaceEntry getEntry() { return entry; }
    public void setEntry(RaceEntry entry) { this.entry = entry; }
    public Integer getFinishRank() { return finishRank; }
    public void setFinishRank(Integer finishRank) { this.finishRank = finishRank; }
    public Long getFinishTimeMs() { return finishTimeMs; }
    public void setFinishTimeMs(Long finishTimeMs) { this.finishTimeMs = finishTimeMs; }
    public Boolean getDisqualified() { return disqualified; }
    public void setDisqualified(Boolean disqualified) { this.disqualified = disqualified; }
    public String getViolationNotes() { return violationNotes; }
    public void setViolationNotes(String violationNotes) { this.violationNotes = violationNotes; }
    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
