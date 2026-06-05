package com.swp391.horseracing.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String message;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(name = "ref_id")
    private Long refId;

    @Column(name = "ref_type", length = 50)
    private String refType;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "email_sent")
    private Boolean emailSent = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Helper method để tạo notification nhanh
    public static Notification create(User user, String title, String message, String type, Long refId, String refType) {
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setTitle(title);
        notif.setMessage(message);
        notif.setType(type);
        notif.setRefId(refId);
        notif.setRefType(refType);
        notif.setIsRead(false);
        notif.setEmailSent(false);
        notif.setCreatedAt(LocalDateTime.now());
        return notif;
    }
}