package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "race", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tournament_id", "round_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Race {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @ManyToOne(fetch = FetchType.LAZY)
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

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RaceStatus status = RaceStatus.SCHEDULED;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RaceStatus {
        SCHEDULED,
        ONGOING,
        FINISHED,
        COMPLETED
    }
}