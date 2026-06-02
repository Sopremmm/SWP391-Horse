package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.JockeyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JockeyProfileRepository extends JpaRepository<JockeyProfile, Long> {
    Optional<JockeyProfile> findByUserId(Long userId);
    Boolean existsByLicenseNumber(String licenseNumber);
}