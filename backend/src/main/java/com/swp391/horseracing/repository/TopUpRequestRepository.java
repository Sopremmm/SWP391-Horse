package com.swp391.horseracing.repository;

import com.swp391.horseracing.entity.TopUpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TopUpRequestRepository extends JpaRepository<TopUpRequest, Long> {
    Optional<TopUpRequest> findByReference(String reference);
    Optional<TopUpRequest> findByBankTxnId(String bankTxnId);
    List<TopUpRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
}

