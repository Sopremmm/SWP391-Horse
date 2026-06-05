package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RaceEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RaceEntryRepository extends JpaRepository<RaceEntry, Long> {
    Optional<RaceEntry> findByHorseIdAndRaceId(Long horseId, Long raceId);
}