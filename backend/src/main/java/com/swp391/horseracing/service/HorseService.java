package com.swp391.horseracing.service;

import com.swp391.horseracing.dto.HorseRequest;
import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorseService {
    private final HorseRepository horseRepository;
    private final UserRepository userRepository;

    @Transactional
    public Horse createHorse(Long ownerId, HorseRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (owner.getRole() != User.Role.HORSE_OWNER) {
            throw new RuntimeException("Only horse owners can add horses");
        }
        Horse horse = new Horse();
        horse.setOwner(owner);
        horse.setName(request.getName());
        horse.setBreed(request.getBreed());
        horse.setAge(request.getAge());
        horse.setWeightKg(request.getWeightKg());
        horse.setColor(request.getColor());
        horse.setImageUrl(request.getImageUrl());
        return horseRepository.save(horse);
    }

    @Transactional
    public Horse updateHorse(Long horseId, Long ownerId, HorseRequest request) {
        Horse horse = horseRepository.findById(horseId)
                .orElseThrow(() -> new RuntimeException("Horse not found"));
        if (!horse.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not the owner of this horse");
        }
        horse.setName(request.getName());
        horse.setBreed(request.getBreed());
        horse.setAge(request.getAge());
        horse.setWeightKg(request.getWeightKg());
        horse.setColor(request.getColor());
        horse.setImageUrl(request.getImageUrl());
        return horseRepository.save(horse);
    }

    public List<Horse> getHorsesByOwnerId(Long ownerId) {
        return horseRepository.findByOwnerId(ownerId);
    }

    public Horse getHorseById(Long horseId) {
        return horseRepository.findById(horseId)
                .orElseThrow(() -> new RuntimeException("Horse not found"));
    }
}