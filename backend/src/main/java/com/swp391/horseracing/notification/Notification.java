package com.swp391.horseracing.notification;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String type; // JOCKEY_INVITE, REG_APPROVED, SYSTEM...

    @Column(name = "ref_id")
    private Long refId;

    @Column(name = "ref_type")
    private String refType;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "email_sent")
    private Boolean emailSent = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}