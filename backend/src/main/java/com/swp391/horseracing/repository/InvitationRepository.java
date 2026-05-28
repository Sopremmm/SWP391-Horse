package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Integer> {
    // Tìm danh sách lời mời được gửi riêng cho một Jockey cụ thể
    List<Invitation> findByJockeyId(Integer jockeyId);
}