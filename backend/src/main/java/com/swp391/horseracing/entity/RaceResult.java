package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "race_result", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"race_id", "finish_rank"}),
    @UniqueConstraint(columnNames = {"race_id", "entry_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RaceResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @OneToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private RaceEntry entry;

    @Column(name = "finish_rank", nullable = false)
    private Integer finishRank;

    @Column(name = "finish_time_ms")
    private Long finishTimeMs;

    private Boolean disqualified = false;

    @Lob
    @Column(name = "violation_notes")
    private String violationNotes;

    @CreationTimestamp
    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;
}
