package com.swp391.horseracing.horse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HorseService {
    @Autowired
    private HorseRepository horseRepository;

    public Horse addHorse(Horse horse) {
        if (horse.getAge() < 2 || horse.getAge() > 15) {
            throw new IllegalArgumentException("Tuổi ngựa tham gia giải đấu phải từ 2 đến 15 tuổi!");
        }
        return horseRepository.save(horse);
    }

    public List<Horse> getHorsesByOwner(Long ownerId) {
        return horseRepository.findByOwnerId(ownerId);
    }
}