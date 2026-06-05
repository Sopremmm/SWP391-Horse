package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jockey_invitation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JockeyInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jockey_id", nullable = false)
    private User jockey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @Enumerated(EnumType.STRING)
    @Column(length = 15)
    private InvitationStatus status = InvitationStatus.PENDING;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String message;

    @Column(name = "invited_at")
    private LocalDateTime invitedAt = LocalDateTime.now();

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    public enum InvitationStatus {
        PENDING, ACCEPTED, DECLINED, EXPIRED
    }

    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    public void expire() {
        if (isExpired() && status == InvitationStatus.PENDING) {
            this.status = InvitationStatus.EXPIRED;
        }
    }
}