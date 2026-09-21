package com.wattvision.backend.repository;

import com.wattvision.backend.entity.WastageEvent;
import com.wattvision.backend.entity.WastageSeverity;
import com.wattvision.backend.entity.WastageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface WastageEventRepository extends JpaRepository<WastageEvent, Long> {

    Page<WastageEvent> findByUserId(Long userId, Pageable pageable);

    Page<WastageEvent> findByUserIdAndStatus(Long userId, WastageStatus status, Pageable pageable);

    Page<WastageEvent> findByUserIdAndSeverity(Long userId, WastageSeverity severity, Pageable pageable);

    Page<WastageEvent> findByUserIdAndTimestampBetween(Long userId, Instant start, Instant end, Pageable pageable);

    Optional<WastageEvent> findByIdAndUserId(Long id, Long userId);

    List<WastageEvent> findByUserIdAndTimestampBetweenOrderByTimestampDesc(Long userId, Instant start, Instant end);

    @Query("SELECT COUNT(w) FROM WastageEvent w WHERE w.user.id = :userId AND w.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") WastageStatus status);

    @Query("SELECT COUNT(w) FROM WastageEvent w WHERE w.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(w.consumptionKWh - w.expectedBaselineKWh) FROM WastageEvent w WHERE w.user.id = :userId AND w.consumptionKWh > w.expectedBaselineKWh")
    Double sumWastageKWhByUserId(@Param("userId") Long userId);
}
