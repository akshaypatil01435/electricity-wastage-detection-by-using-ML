package com.wattvision.backend.repository;

import com.wattvision.backend.entity.ConsumptionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ConsumptionRecordRepository extends JpaRepository<ConsumptionRecord, Long> {

    Page<ConsumptionRecord> findByUserIdAndTimestampBetween(Long userId, Instant start, Instant end, Pageable pageable);

    Page<ConsumptionRecord> findByUserId(Long userId, Pageable pageable);

    List<ConsumptionRecord> findByUserIdAndTimestampBetweenOrderByTimestampAsc(Long userId, Instant start, Instant end);

    List<ConsumptionRecord> findByUserIdOrderByTimestampAsc(Long userId);

    List<ConsumptionRecord> findTop200ByUserIdOrderByTimestampDesc(Long userId);

    List<ConsumptionRecord> findTop500ByProcessedFalseOrderByTimestampAsc();

    @Query("SELECT SUM(c.consumptionKWh) FROM ConsumptionRecord c WHERE c.user.id = :userId AND c.timestamp BETWEEN :start AND :end")
    Double sumConsumptionByUserIdAndTimestampBetween(@Param("userId") Long userId, @Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT COUNT(c) FROM ConsumptionRecord c WHERE c.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}
