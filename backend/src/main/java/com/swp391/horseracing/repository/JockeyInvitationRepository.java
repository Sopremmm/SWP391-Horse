package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.JockeyInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JockeyInvitationRepository extends JpaRepository<JockeyInvitation, Long> {
    List<JockeyInvitation> findByJockeyId(Long jockeyId);
    List<JockeyInvitation> findByOwnerId(Long ownerId);
}
