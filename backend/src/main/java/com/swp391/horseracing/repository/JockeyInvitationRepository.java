package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.JockeyInvitation;
import com.swp391.horseracing.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JockeyInvitationRepository extends JpaRepository<JockeyInvitation, Long> {

    List<JockeyInvitation> findByJockeyAndStatus(User jockey, JockeyInvitation.InvitationStatus status);

    List<JockeyInvitation> findByJockeyIdAndStatus(Long jockeyId, JockeyInvitation.InvitationStatus status);

    List<JockeyInvitation> findByOwnerIdAndStatus(Long ownerId, JockeyInvitation.InvitationStatus status);

    Optional<JockeyInvitation> findByIdAndJockeyId(Long id, Long jockeyId);

    Optional<JockeyInvitation> findByIdAndOwnerId(Long id, Long ownerId);

    boolean existsByHorseIdAndJockeyIdAndRaceIdAndStatusIn(
            Long horseId, Long jockeyId, Long raceId,
            List<JockeyInvitation.InvitationStatus> statuses);

    @Modifying
    @Transactional
    @Query("UPDATE JockeyInvitation i SET i.status = 'EXPIRED' WHERE i.status = 'PENDING' AND i.expiresAt < :now")
    int expirePendingInvitations(@Param("now") LocalDateTime now);
}