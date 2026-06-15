package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "bet", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"spectator_id", "race_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spectator_id", nullable = false)
    private User spectator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "predicted_entry_id", nullable = false)
    private RaceEntry predictedEntry;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private BetResult result = BetResult.PENDING;

    @CreationTimestamp
    @Column(name = "placed_at", updatable = false)
    private LocalDateTime placedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public enum BetResult {
        PENDING, WIN, LOSE
    }
}