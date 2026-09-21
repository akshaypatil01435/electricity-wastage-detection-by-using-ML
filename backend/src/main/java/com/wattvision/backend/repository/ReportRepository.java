package com.wattvision.backend.repository;

import com.wattvision.backend.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Report> findByIdAndUserId(Long id, Long userId);
}
