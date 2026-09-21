package com.wattvision.backend.dto;

import com.wattvision.backend.entity.Report;
import com.wattvision.backend.entity.ReportType;
import java.time.Instant;
import java.time.LocalDate;

public record ReportResponse(
        Long id,
        Long userId,
        String title,
        ReportType reportType,
        LocalDate startDate,
        LocalDate endDate,
        Double totalConsumptionKWh,
        Double estimatedWastageKWh,
        Double estimatedCostINR,
        Double potentialSavingsINR,
        Integer anomaliesCount,
        String summaryNotes,
        Instant createdAt
) {
    public static ReportResponse from(Report r) {
        return new ReportResponse(
                r.getId(),
                r.getUser() != null ? r.getUser().getId() : null,
                r.getTitle(),
                r.getReportType(),
                r.getStartDate(),
                r.getEndDate(),
                r.getTotalConsumptionKWh(),
                r.getEstimatedWastageKWh(),
                r.getEstimatedCostINR(),
                r.getPotentialSavingsINR(),
                r.getAnomaliesCount(),
                r.getSummaryNotes(),
                r.getCreatedAt()
        );
    }
}
