package com.wattvision.backend.repository;

import com.wattvision.backend.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Page<Alert> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Alert> findTop50ByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Alert> findByIdAndUserId(Long id, Long userId);

    Long countByUserIdAndReadFalse(Long userId);

    @Modifying
    @Query("UPDATE Alert a SET a.read = true WHERE a.user.id = :userId AND a.read = false")
    int markAllAsReadByUserId(@Param("userId") Long userId);
}
