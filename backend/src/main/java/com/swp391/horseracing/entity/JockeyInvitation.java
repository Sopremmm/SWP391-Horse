package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jockey_invitation", uniqueConstraints = {@UniqueConstraint(columnNames = {"horse_id", "jockey_id", "race_id"})})
public class JockeyInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "horse_id", nullable = false)
    private Horse horse;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne
    @JoinColumn(name = "jockey_id", nullable = false)
    private User jockey;

    @ManyToOne
    @JoinColumn(name = "race_id", nullable = false)
    private Race race;

    @Column(length = 15)
    private String status = "PENDING"; // PENDING, ACCEPTED, DECLINED, EXPIRED

    @Lob
    @Column
    private String message;

    @CreationTimestamp
    @Column(name = "invited_at", updatable = false)
    private LocalDateTime invitedAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    public JockeyInvitation() {}

    public JockeyInvitation(Horse horse, User owner, User jockey, Race race, String message, String status, LocalDateTime invitedAt, LocalDateTime expiresAt) {
        this.horse = horse;
        this.owner = owner;
        this.jockey = jockey;
        this.race = race;
        this.message = message;
        this.status = status;
        this.invitedAt = invitedAt;
        this.expiresAt = expiresAt;
    }

    public static JockeyInvitationBuilder builder() {
        return new JockeyInvitationBuilder();
    }

    public static class JockeyInvitationBuilder {
        private Horse horse;
        private User owner;
        private User jockey;
        private Race race;
        private String message;
        private String status;
        private LocalDateTime invitedAt;
        private LocalDateTime expiresAt;

        public JockeyInvitationBuilder horse(Horse horse) { this.horse = horse; return this; }
        public JockeyInvitationBuilder owner(User owner) { this.owner = owner; return this; }
        public JockeyInvitationBuilder jockey(User jockey) { this.jockey = jockey; return this; }
        public JockeyInvitationBuilder race(Race race) { this.race = race; return this; }
        public JockeyInvitationBuilder message(String message) { this.message = message; return this; }
        public JockeyInvitationBuilder status(String status) { this.status = status; return this; }
        public JockeyInvitationBuilder invitedAt(LocalDateTime invitedAt) { this.invitedAt = invitedAt; return this; }
        public JockeyInvitationBuilder expiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; return this; }
        public JockeyInvitation build() {
            return new JockeyInvitation(horse, owner, jockey, race, message, status, invitedAt, expiresAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Horse getHorse() { return horse; }
    public void setHorse(Horse horse) { this.horse = horse; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public User getJockey() { return jockey; }
    public void setJockey(User jockey) { this.jockey = jockey; }
    public Race getRace() { return race; }
    public void setRace(Race race) { this.race = race; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getInvitedAt() { return invitedAt; }
    public void setInvitedAt(LocalDateTime invitedAt) { this.invitedAt = invitedAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
