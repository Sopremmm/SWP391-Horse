package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RaceResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RaceResultRepository extends JpaRepository<RaceResult, Long> {
    Optional<RaceResult> findByRaceIdAndFinishRank(Long raceId, Integer finishRank);
}