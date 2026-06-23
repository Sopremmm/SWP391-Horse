package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.request.AdminCreateUserRequest;
import com.swp391.horseracing.dto.request.AdminUpdateUserRequest;
import com.swp391.horseracing.dto.request.AdminUpdateUserStatusRequest;
import com.swp391.horseracing.dto.response.MessageResponse;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.AdminUserService;
import com.swp391.horseracing.service.UserQueryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    @Autowired
    private UserQueryService userQueryService;

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<User>> listUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String q
    ) {
        Role roleEnum = null;
        if (role != null && !role.isBlank()) {
            roleEnum = Role.valueOf(role.trim().toUpperCase());
        }
        return ResponseEntity.ok(userQueryService.searchUsers(roleEnum, q));
    }

    @PostMapping
    public ResponseEntity<User> create(@Valid @RequestBody AdminCreateUserRequest request, @AuthenticationPrincipal UserDetailsImpl admin) {
        return ResponseEntity.ok(adminUserService.createUser(
                admin.getId(),
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhone(),
                request.getRole()
        ));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @Valid @RequestBody AdminUpdateUserStatusRequest request, @AuthenticationPrincipal UserDetailsImpl admin) {
        return ResponseEntity.ok(adminUserService.updateStatus(admin.getId(), id, request.getStatus()));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> update(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request,
            @AuthenticationPrincipal UserDetailsImpl admin
    ) {
        return ResponseEntity.ok(adminUserService.updateUser(
                admin.getId(),
                id,
                request.getEmail(),
                request.getFullName(),
                request.getPhone(),
                request.getRole(),
                request.getPassword()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl admin) {
        adminUserService.deleteUser(admin.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Deleted"));
    }
}
