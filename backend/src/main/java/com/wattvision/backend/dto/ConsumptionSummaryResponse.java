package com.wattvision.backend.dto;

public record ConsumptionSummaryResponse(
        Double totalKWh,
        Double dailyAverageKWh,
        Double estimatedCostINR,
        Double monthlyGoalKWh,
        Double goalProgressPercent,
        Double trendPercent,
        Long totalReadingsCount
) {}
