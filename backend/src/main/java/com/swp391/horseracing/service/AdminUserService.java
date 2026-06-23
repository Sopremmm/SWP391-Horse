package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.entity.enums.UserStatus;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AdminUserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService;

    public User createUser(Long actorAdminId, String email, String password, String fullName, String phone, String role) {
        String normalizedEmail = email == null ? null : email.trim().toLowerCase(Locale.ROOT);
        if (normalizedEmail == null || normalizedEmail.isBlank()) {
            throw new RuntimeException("Error: Email is required!");
        }
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role roleEnum = Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .phone(phone)
                .role(roleEnum)
                .status(UserStatus.ACTIVE)
                .build();
        User saved = userRepository.save(user);
        auditLogService.log(actorAdminId, "ADMIN_CREATE_USER", "USER", saved.getId(), "role=" + roleEnum.name() + ", email=" + normalizedEmail);
        return saved;
    }

    public User updateStatus(Long actorAdminId, Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        UserStatus next = UserStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        user.setStatus(next);
        User saved = userRepository.save(user);
        auditLogService.log(actorAdminId, "ADMIN_UPDATE_USER_STATUS", "USER", saved.getId(), "status=" + next.name());
        return saved;
    }

    public User updateUser(Long actorAdminId, Long userId, String email, String fullName, String phone, String role, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        String details = "";

        if (email != null) {
            String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
            if (normalizedEmail.isBlank()) {
                throw new RuntimeException("Error: Email is required!");
            }
            userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresent(existing -> {
                if (!existing.getId().equals(userId)) {
                    throw new RuntimeException("Error: Email is already in use!");
                }
            });
            user.setEmail(normalizedEmail);
            details += "email=" + normalizedEmail + "; ";
        }

        if (fullName != null) {
            String normalizedName = fullName.trim();
            if (normalizedName.isBlank()) {
                throw new RuntimeException("Error: Full name is required!");
            }
            user.setFullName(normalizedName);
            details += "fullName=" + normalizedName + "; ";
        }

        if (phone != null) {
            user.setPhone(phone.trim().isBlank() ? null : phone.trim());
            details += "phoneUpdated=true; ";
        }

        if (role != null && !role.trim().isBlank()) {
            Role nextRole = Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
            user.setRole(nextRole);
            details += "role=" + nextRole.name() + "; ";
        }

        if (password != null && !password.trim().isBlank()) {
            user.setPassword(passwordEncoder.encode(password.trim()));
            details += "passwordReset=true; ";
        }

        User saved = userRepository.save(user);
        auditLogService.log(actorAdminId, "ADMIN_UPDATE_USER", "USER", saved.getId(), details.isBlank() ? "no_changes" : details.trim());
        return saved;
    }

    public void deleteUser(Long actorAdminId, Long userId) {
        if (actorAdminId != null && actorAdminId.equals(userId)) {
            throw new RuntimeException("Error: Admin cannot delete own account!");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        try {
            userRepository.delete(user);
            userRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error: User has related data, please change status/role instead of deleting!");
        }
        auditLogService.log(actorAdminId, "ADMIN_DELETE_USER", "USER", userId, "email=" + user.getEmail());
    }
}
