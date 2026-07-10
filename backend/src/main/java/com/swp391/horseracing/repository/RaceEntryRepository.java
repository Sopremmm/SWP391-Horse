package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RaceEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RaceEntryRepository extends JpaRepository<RaceEntry, Long> {
    List<RaceEntry> findByTournamentId(Long tournamentId);
    List<RaceEntry> findByRaceId(Long raceId);
    List<RaceEntry> findByHorseId(Long horseId);
}
