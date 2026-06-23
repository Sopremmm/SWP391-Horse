package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Prize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrizeRepository extends JpaRepository<Prize, Long> {
    List<Prize> findByRaceIdOrderByFinishRankAsc(Long raceId);
    List<Prize> findByRaceTournamentId(Long tournamentId);
    Optional<Prize> findByRaceIdAndEntryId(Long raceId, Long entryId);
}
