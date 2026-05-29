package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvitationID")
    private Integer invitationId;

    @Column(name = "RaceID", nullable = false)
    private Integer raceId;

    @Column(name = "HorseID", nullable = false)
    private Integer horseId;

    @Column(name = "JockeyID", nullable = false)
    private Integer jockeyId;

    @Column(name = "Status", nullable = false, length = 20)
    private String status = "Pending"; // Các trạng thái: Pending, Accepted, Declined

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt = LocalDateTime.now();
}