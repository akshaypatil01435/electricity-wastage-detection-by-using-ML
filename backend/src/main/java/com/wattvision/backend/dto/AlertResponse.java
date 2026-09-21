package com.wattvision.backend.dto;

import com.wattvision.backend.entity.Alert;
import com.wattvision.backend.entity.AlertType;
import java.time.Instant;

public record AlertResponse(
        Long id,
        Long userId,
        Long wastageEventId,
        String title,
        String message,
        AlertType type,
        boolean read,
        Instant createdAt
) {
    public static AlertResponse from(Alert alert) {
        return new AlertResponse(
                alert.getId(),
                alert.getUser() != null ? alert.getUser().getId() : null,
                alert.getWastageEventId(),
                alert.getTitle(),
                alert.getMessage(),
                alert.getType(),
                alert.isRead(),
                alert.getCreatedAt()
        );
    }
}
