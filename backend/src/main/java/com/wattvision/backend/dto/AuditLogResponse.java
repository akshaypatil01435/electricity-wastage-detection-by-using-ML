package com.wattvision.backend.dto;

import com.wattvision.backend.entity.AuditLog;
import java.time.Instant;

public record AuditLogResponse(
        Long id,
        String actorEmail,
        String actorRole,
        String action,
        String resource,
        String details,
        String ipAddress,
        Instant createdAt
) {
    public static AuditLogResponse from(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getActorEmail(),
                log.getActorRole(),
                log.getAction(),
                log.getResource(),
                log.getDetails(),
                log.getIpAddress(),
                log.getCreatedAt()
        );
    }
}
