package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorseService {
    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private UserRepository userRepository;

    public Horse addHorse(Horse horse, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found!"));
        horse.setOwner(owner);
        horse.setStatus("ACTIVE");
        horse.setCondition(normalizeCondition(horse.getCondition()));
        return horseRepository.save(horse);
    }

    public Horse updateHorse(Long id, Horse horseDetails, Long ownerId) {
        Horse horse = horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
        if (horse.getOwner() == null || horse.getOwner().getId() == null || !horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Error: You are not the owner of this horse!");
        }
        
        horse.setName(horseDetails.getName());
        horse.setBreed(horseDetails.getBreed());
        horse.setAge(horseDetails.getAge());
        horse.setWeightKg(horseDetails.getWeightKg());
        horse.setImageUrl(horseDetails.getImageUrl());
        horse.setColor(horseDetails.getColor());
        horse.setCondition(normalizeCondition(horseDetails.getCondition()));
        
        return horseRepository.save(horse);
    }

    public List<Horse> getMyHorses(Long ownerId) {
        return horseRepository.findByOwnerId(ownerId);
    }

    public Horse getHorseById(Long id) {
        return horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
    }

    public List<Horse> getAllHorses() {
        return horseRepository.findAll();
    }

    private String normalizeCondition(String condition) {
        if (condition == null || condition.isBlank()) return "PEAK";
        String normalized = condition.trim().toUpperCase();
        if (!List.of("PEAK", "GOOD", "RECOVERING").contains(normalized)) {
            throw new RuntimeException("Error: Horse condition must be PEAK, GOOD, or RECOVERING!");
        }
        return normalized;
    }
}
