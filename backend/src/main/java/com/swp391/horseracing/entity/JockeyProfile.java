package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "jockey_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JockeyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, name = "license_number", length = 50)
    private String licenseNumber;

    @Column(name = "weight_kg", precision = 5, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(name = "total_races")
    private Integer totalRaces = 0;

    @Column(name = "total_wins")
    private Integer totalWins = 0;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String bio;
}