package com.swp391.horseracing.horse;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HorseRepository extends JpaRepository<Horse, Long> {
    List<Horse> findByOwnerId(Long ownerId);
}