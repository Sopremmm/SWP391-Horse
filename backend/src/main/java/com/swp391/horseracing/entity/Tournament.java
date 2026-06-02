package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tournament")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "prize_pool", precision = 15, scale = 2)
    private BigDecimal prizePool = BigDecimal.ZERO;

    @Column(name = "max_horses")
    private Integer maxHorses = 20;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TournamentStatus status = TournamentStatus.DRAFT;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TournamentStatus {
        DRAFT,
        OPEN,
        ONGOING,
        CLOSED
    }
}