package com.swp391.horseracing.horse;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "horse")
@Data
public class Horse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String name;

    private String breed;
    private Integer age;

    @Column(name = "weight_kg")
    private Double weightKg;

    private String color;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "total_races")
    private Integer totalRaces = 0;

    @Column(name = "total_wins")
    private Integer totalWins = 0;

    private String status = "ACTIVE";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}