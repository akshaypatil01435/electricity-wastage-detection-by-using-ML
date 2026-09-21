package com.wattvision.backend.repository;

import com.wattvision.backend.entity.Role;
import com.wattvision.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByRole(Role role);

    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Long countByActiveTrue();

    Long countByRole(Role role);
}
