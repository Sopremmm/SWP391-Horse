package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Bet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    boolean existsBySpectatorIdAndRaceId(Long spectatorId, Long raceId);
    List<Bet> findBySpectatorIdOrderByPlacedAtDesc(Long spectatorId);
    List<Bet> findByRaceId(Long raceId);
}
