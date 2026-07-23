package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.entity.enums.Role;
import com.swp391.horseracing.service.UserQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserQueryService userQueryService;

    @GetMapping("/jockeys")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HORSE_OWNER')")
    public ResponseEntity<List<User>> getJockeys() {
        return ResponseEntity.ok(userQueryService.getUsersByRole(Role.JOCKEY));
    }

    @GetMapping("/referees")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getReferees() {
        return ResponseEntity.ok(userQueryService.getUsersByRole(Role.REFEREE));
    }
}

