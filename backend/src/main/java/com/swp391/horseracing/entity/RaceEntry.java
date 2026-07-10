package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "race_entry", uniqueConstraints = {@UniqueConstraint(columnNames = {"horse_id", "tournament_id"})})
public class RaceEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne
    @JoinColumn(name = "jockey_id")
    private User jockey;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "race_id")
    private Race race;

    @Column(length = 15)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, CONFIRMED

    @CreationTimestamp
    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    public RaceEntry() {}

    public RaceEntry(Horse horse, User jockey, Tournament tournament, Race race, String status) {
        this.horse = horse;
        this.jockey = jockey;
        this.tournament = tournament;
        this.race = race;
        this.status = status;
    }

    public static RaceEntryBuilder builder() {
        return new RaceEntryBuilder();
    }

    public static class RaceEntryBuilder {
        private Horse horse;
        private User jockey;
        private Tournament tournament;
        private Race race;
        private String status;

        public RaceEntryBuilder horse(Horse horse) { this.horse = horse; return this; }
        public RaceEntryBuilder jockey(User jockey) { this.jockey = jockey; return this; }
        public RaceEntryBuilder tournament(Tournament tournament) { this.tournament = tournament; return this; }
        public RaceEntryBuilder race(Race race) { this.race = race; return this; }
        public RaceEntryBuilder status(String status) { this.status = status; return this; }
        public RaceEntry build() {
            return new RaceEntry(horse, jockey, tournament, race, status);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Horse getHorse() { return horse; }
    public void setHorse(Horse horse) { this.horse = horse; }
    public User getJockey() { return jockey; }
    public void setJockey(User jockey) { this.jockey = jockey; }
    public Tournament getTournament() { return tournament; }
    public void setTournament(Tournament tournament) { this.tournament = tournament; }
    public Race getRace() { return race; }
    public void setRace(Race race) { this.race = race; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
