package com.swp391.horseracing.dto;

import com.swp391.horseracing.entity.JockeyInvitation;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private Long id;
    private Long horseId;
    private String horseName;
    private Long ownerId;
    private String ownerName;
    private Long raceId;
    private String raceName;
    private LocalDateTime raceDate;
    private String status;
    private String message;
    private LocalDateTime invitedAt;
    private LocalDateTime expiresAt;

    public static InvitationResponse fromEntity(JockeyInvitation invitation) {
        InvitationResponse response = new InvitationResponse();
        response.setId(invitation.getId());
        response.setHorseId(invitation.getHorse().getId());
        response.setHorseName(invitation.getHorse().getName());
        response.setOwnerId(invitation.getOwner().getId());
        response.setOwnerName(invitation.getOwner().getFullName());
        response.setRaceId(invitation.getRace().getId());
        response.setRaceName(invitation.getRace().getName());
        response.setRaceDate(invitation.getRace().getRaceDate());
        response.setStatus(invitation.getStatus().name());
        response.setMessage(invitation.getMessage());
        response.setInvitedAt(invitation.getInvitedAt());
        response.setExpiresAt(invitation.getExpiresAt());
        return response;
    }
}