package com.wattvision.backend.dto;

public record ConsumptionAggregatePoint(
        String period,
        Double consumptionKWh,
        Double costINR,
        Double expectedBaselineKWh
) {}
