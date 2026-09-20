package com.wattvision.backend.dto;

import com.wattvision.backend.entity.User;

import java.time.Instant;

/**
 * Role is returned as ROLE_USER / ROLE_ADMIN to match the React frontend's USER_ROLES constants.
 */
public record UserResponse(Long id, String name, String email, String role, boolean active, Instant createdAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                "ROLE_" + user.getRole().name(),
                user.isActive(),
                user.getCreatedAt());
    }
}
