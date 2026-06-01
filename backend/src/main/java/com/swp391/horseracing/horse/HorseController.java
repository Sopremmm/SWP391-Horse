package com.swp391.horseracing.horse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/horses")
@CrossOrigin(origins = "*")
public class HorseController {

    @Autowired
    private HorseService horseService;

    @PostMapping
    public ResponseEntity<?> createHorse(@RequestBody Horse horse) {
        try {
            Horse savedHorse = horseService.addHorse(horse);
            return ResponseEntity.status(21).body(savedHorse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Horse>> getMyHorses(@PathVariable Long ownerId) {
        return ResponseEntity.ok(horseService.getHorsesByOwner(ownerId));
    }
}