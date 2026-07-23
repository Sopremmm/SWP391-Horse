package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RaceEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface RaceEntryRepository extends JpaRepository<RaceEntry, Long> {
    List<RaceEntry> findByTournamentId(Long tournamentId);
    List<RaceEntry> findByRaceId(Long raceId);
    List<RaceEntry> findByHorseId(Long horseId);
    RaceEntry findByTournamentIdAndHorseId(Long tournamentId, Long horseId);

    @Modifying
    @Query("DELETE FROM RaceEntry e WHERE e.tournament.id = :tournamentId")
    void deleteByTournamentId(@Param("tournamentId") Long tournamentId);
}
