package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.RefereeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefereeReportRepository extends JpaRepository<RefereeReport, Long> {
    Optional<RefereeReport> findByRaceId(Long raceId);
    List<RefereeReport> findBySubmittedTrueAndConfirmedFalseOrderBySubmittedAtDesc();
    List<RefereeReport> findByConfirmedTrueOrderByConfirmedAtDesc();
}
