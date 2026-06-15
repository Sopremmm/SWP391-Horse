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
        
        return horseRepository.save(horse);
    }

    public List<Horse> getMyHorses(Long ownerId) {
        return horseRepository.findByOwnerId(ownerId);
    }

    public Horse getHorseById(Long id) {
        return horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
    }
}
