package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.AuditLog;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.AuditLogRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void log(Long actorUserId, String action, String refType, Long refId, String details) {
        if (actorUserId == null) {
            return;
        }
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        AuditLog audit = AuditLog.builder()
                .actor(actor)
                .action(action)
                .refType(refType)
                .refId(refId)
                .details(details)
                .build();
        auditLogRepository.save(audit);
    }

    public List<AuditLog> search(Long actorId, String action, String q) {
        return auditLogRepository.search(actorId, action, q);
    }
}

