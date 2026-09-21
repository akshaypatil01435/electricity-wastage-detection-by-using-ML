package com.wattvision.backend.dto;

import com.wattvision.backend.entity.WastageEvent;
import com.wattvision.backend.entity.WastageSeverity;
import com.wattvision.backend.entity.WastageStatus;
import java.time.Instant;

public record WastageEventResponse(
        Long id,
        Long userId,
        Long consumptionRecordId,
        Instant timestamp,
        Double consumptionKWh,
        Double expectedBaselineKWh,
        Double differenceKWh,
        Double differencePercent,
        Double anomalyScore,
        WastageSeverity severity,
        String reason,
        String recommendation,
        WastageStatus status,
        String resolutionNote,
        Instant resolvedAt,
        Instant createdAt
) {
    public static WastageEventResponse from(WastageEvent event) {
        double diff = event.getConsumptionKWh() - event.getExpectedBaselineKWh();
        double pct = event.getExpectedBaselineKWh() > 0 ? (diff / event.getExpectedBaselineKWh()) * 100.0 : 0.0;
        return new WastageEventResponse(
                event.getId(),
                event.getUser() != null ? event.getUser().getId() : null,
                event.getConsumptionRecordId(),
                event.getTimestamp(),
                event.getConsumptionKWh(),
                event.getExpectedBaselineKWh(),
                Math.round(diff * 100.0) / 100.0,
                Math.round(pct * 10.0) / 10.0,
                event.getAnomalyScore(),
                event.getSeverity(),
                event.getReason(),
                event.getRecommendation(),
                event.getStatus(),
                event.getResolutionNote(),
                event.getResolvedAt(),
                event.getCreatedAt()
        );
    }
}
