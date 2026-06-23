package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RaceResultRepository extends JpaRepository<RaceResult, Long> {
    List<RaceResult> findByRaceId(Long raceId);
    List<RaceResult> findByRaceIdOrderByFinishRankAsc(Long raceId);
    List<RaceResult> findByRaceTournamentId(Long tournamentId);
    Optional<RaceResult> findByRaceIdAndEntryId(Long raceId, Long entryId);
    Optional<RaceResult> findFirstByRaceIdAndFinishRank(Long raceId, Integer finishRank);
    boolean existsByRaceIdAndFinishRank(Long raceId, Integer finishRank);
}
