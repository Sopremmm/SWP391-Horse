package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Horse;
import com.swp391.horseracing.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorseRepository extends JpaRepository<Horse, Long> {
    List<Horse> findByOwner(User owner);
    List<Horse> findByOwnerId(Long ownerId);
}
