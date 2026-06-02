package com.swp391.horseracing.controller;

import com.swp391.horseracing.dto.HorseRequest;
import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.security.UserDetailsImpl;
import com.swp391.horseracing.service.HorseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/horses")
@RequiredArgsConstructor
public class HorseController {
    private final HorseService horseService;

    @PostMapping
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<Horse> createHorse(@Valid @RequestBody HorseRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(horseService.createHorse(userDetails.getId(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<Horse> updateHorse(@PathVariable Long id, @Valid @RequestBody HorseRequest request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(horseService.updateHorse(id, userDetails.getId(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<List<Horse>> getMyHorses() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(horseService.getHorsesByOwnerId(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horse> getHorseById(@PathVariable Long id) {
        return ResponseEntity.ok(horseService.getHorseById(id));
    }
}