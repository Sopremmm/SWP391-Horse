package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bet", uniqueConstraints = {@UniqueConstraint(columnNames = {"spectator_id", "race_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "spectator_id", nullable = false)
    private User spectator;

    @ManyToOne
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne
    @JoinColumn(name = "predicted_entry_id", nullable = false)
    private RaceEntry predictedEntry;

    @Column(length = 10)
    private String result = "PENDING"; // PENDING, WIN, LOSE

    @CreationTimestamp
    @Column(name = "placed_at", updatable = false)
    private LocalDateTime placedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
