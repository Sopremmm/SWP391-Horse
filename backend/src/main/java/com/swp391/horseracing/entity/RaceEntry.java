package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "race_entry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RaceEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jockey_id")
    private User jockey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id")
    private Race race;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private EntryStatus status = EntryStatus.PENDING;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    public enum EntryStatus {
        PENDING, APPROVED, REJECTED, CONFIRMED
    }
}