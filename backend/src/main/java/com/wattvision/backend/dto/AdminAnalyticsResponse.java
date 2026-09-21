package com.wattvision.backend.dto;

public record AdminAnalyticsResponse(
        Long totalUsers,
        Long activeUsers,
        Long adminCount,
        Long totalConsumptionRecords,
        Double totalEnergyConsumedKWh,
        Long totalWastageEvents,
        Long unresolvedWastageEvents,
        Double totalWastageKWh,
        Double totalEstimatedLossINR,
        Double fleetHealthScorePercent
) {}
