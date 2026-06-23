package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "race", uniqueConstraints = {@UniqueConstraint(columnNames = {"tournament_id", "round_number"})})
public class Race {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne
    @JoinColumn(name = "referee_id")
    private User referee;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "round_number")
    private Integer roundNumber = 1;

    @Column(name = "race_date", nullable = false)
    private LocalDateTime raceDate;

    @Column(name = "distance_m", nullable = false)
    private Integer distanceM;

    @Column(name = "max_participants")
    private Integer maxParticipants = 12;

    @Column(length = 20)
    private String status = "SCHEDULED"; // SCHEDULED, ONGOING, FINISHED, COMPLETED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Race() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Tournament getTournament() { return tournament; }
    public void setTournament(Tournament tournament) { this.tournament = tournament; }
    public User getReferee() { return referee; }
    public void setReferee(User referee) { this.referee = referee; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getRoundNumber() { return roundNumber; }
    public void setRoundNumber(Integer roundNumber) { this.roundNumber = roundNumber; }
    public LocalDateTime getRaceDate() { return raceDate; }
    public void setRaceDate(LocalDateTime raceDate) { this.raceDate = raceDate; }
    public Integer getDistanceM() { return distanceM; }
    public void setDistanceM(Integer distanceM) { this.distanceM = distanceM; }
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
