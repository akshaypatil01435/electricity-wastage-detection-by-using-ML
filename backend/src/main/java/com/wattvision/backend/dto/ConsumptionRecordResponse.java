package com.wattvision.backend.dto;

import com.wattvision.backend.entity.ConsumptionRecord;
import java.time.Instant;

public record ConsumptionRecordResponse(
        Long id,
        Long userId,
        Instant timestamp,
        Double consumptionKWh,
        String source,
        boolean processed,
        Instant createdAt
) {
    public static ConsumptionRecordResponse from(ConsumptionRecord record) {
        return new ConsumptionRecordResponse(
                record.getId(),
                record.getUser() != null ? record.getUser().getId() : null,
                record.getTimestamp(),
                record.getConsumptionKWh(),
                record.getSource(),
                record.isProcessed(),
                record.getCreatedAt()
        );
    }
}
