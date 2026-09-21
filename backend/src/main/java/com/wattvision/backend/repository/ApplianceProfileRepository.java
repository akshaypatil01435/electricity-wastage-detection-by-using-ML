package com.wattvision.backend.repository;

import com.wattvision.backend.entity.ApplianceProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplianceProfileRepository extends JpaRepository<ApplianceProfile, Long> {

    List<ApplianceProfile> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<ApplianceProfile> findByIdAndUserId(Long id, Long userId);

    Long countByUserId(Long userId);
}
