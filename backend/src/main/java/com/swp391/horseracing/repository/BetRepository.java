package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Bet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    Optional<Bet> findBySpectatorIdAndRaceId(Long spectatorId, Long raceId);
    Page<Bet> findBySpectatorId(Long spectatorId, Pageable pageable);
    List<Bet> findByRaceId(Long raceId);
    boolean existsBySpectatorIdAndRaceId(Long spectatorId, Long raceId);
}