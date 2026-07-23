package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    @Query("""
            select a from AuditLog a
            where (:actorId is null or a.actor.id = :actorId)
              and (coalesce(:action, '') = '' or a.action = :action)
              and (coalesce(:q, '') = '' or a.details like concat(concat('%', :q), '%'))
            order by a.createdAt desc
            """)
    List<AuditLog> search(@Param("actorId") Long actorId, @Param("action") String action, @Param("q") String q);
}
