package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "horse")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Horse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String breed;

    @Column
    private Integer age;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(length = 50)
    private String color;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "total_races")
    private Integer totalRaces = 0;

    @Column(name = "total_wins")
    private Integer totalWins = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private HorseStatus status = HorseStatus.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum HorseStatus {
        ACTIVE,
        RETIRED
    }
}