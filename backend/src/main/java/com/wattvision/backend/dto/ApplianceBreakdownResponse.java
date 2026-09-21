package com.wattvision.backend.dto;

import com.wattvision.backend.entity.ApplianceCategory;

public record ApplianceBreakdownResponse(
        Long id,
        String name,
        ApplianceCategory category,
        Double monthlyKWh,
        Double monthlyCostINR,
        Double percentage
) {}
