package com.swp391.horseracing.dto;

import com.swp391.horseracing.entity.Notification;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Long refId;
    private String refType;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationResponse fromEntity(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getRefId(),
                notification.getRefType(),
                notification.getIsRead(),
                notification.getCreatedAt()
        );
    }
}