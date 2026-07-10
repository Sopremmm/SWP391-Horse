package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "referee_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefereeReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "race_id", nullable = false, unique = true)
    private Race race;

    @ManyToOne
    @JoinColumn(name = "referee_id")
    private User referee;

    @Lob
    @Column
    private String violations;

    @Lob
    @Column
    private String notes;

    private Boolean confirmed = false;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
}
