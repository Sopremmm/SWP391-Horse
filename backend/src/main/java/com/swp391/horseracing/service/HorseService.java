package com.swp391.horseracing.service;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.User;
import com.swp391.horseracing.repository.HorseRepository;
import com.swp391.horseracing.repository.UserRepository;
import com.swp391.horseracing.repository.RaceEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorseService {
    @Autowired
    private HorseRepository horseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RaceEntryRepository raceEntryRepository;

    public Horse addHorse(Horse horse, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found!"));
        horse.setOwner(owner);
        horse.setStatus("ACTIVE");
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
        horse.setAgeType(horseDetails.getAgeType());
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

    public List<Horse> getAllHorses() {
        return horseRepository.findAll();
    }

    public void deleteHorse(Long id, Long ownerId) {
        Horse horse = horseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Horse not found!"));
        if (horse.getOwner() == null || !ownerId.equals(horse.getOwner().getId())) {
            throw new RuntimeException("Error: You are not the owner of this horse!");
        }
        if (!raceEntryRepository.findByHorseId(id).isEmpty()) {
            throw new RuntimeException("Error: A horse with tournament history cannot be deleted; retire it instead!");
        }
        horseRepository.delete(horse);
    }

}
