package com.swp391.horseracing.controller;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.security.user.UserDetailsImpl;
import com.swp391.horseracing.service.HorseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horses")
public class HorseController {
    @Autowired
    private HorseService horseService;

    @PostMapping
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<Horse> addHorse(@RequestBody Horse horse, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(horseService.addHorse(horse, userDetails.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<Horse> updateHorse(@PathVariable Long id, @RequestBody Horse horse, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(horseService.updateHorse(id, horse, userDetails.getId()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('HORSE_OWNER')")
    public ResponseEntity<List<Horse>> getMyHorses(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(horseService.getMyHorses(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horse> getHorseById(@PathVariable Long id) {
        return ResponseEntity.ok(horseService.getHorseById(id));
    }
}
