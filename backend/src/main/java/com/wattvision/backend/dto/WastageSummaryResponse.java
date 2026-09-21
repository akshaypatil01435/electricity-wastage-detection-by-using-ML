package com.wattvision.backend.dto;

public record WastageSummaryResponse(
        Long totalEvents,
        Long unresolvedCount,
        Long resolvedCount,
        Long criticalCount,
        Double totalWastageKWh,
        Double estimatedLossINR,
        Double potentialSavingsINR
) {}
