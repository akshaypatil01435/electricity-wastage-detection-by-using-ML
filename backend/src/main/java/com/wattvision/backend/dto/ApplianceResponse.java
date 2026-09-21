package com.wattvision.backend.dto;

import com.wattvision.backend.entity.ApplianceCategory;
import com.wattvision.backend.entity.ApplianceProfile;
import java.time.Instant;

public record ApplianceResponse(
        Long id,
        Long userId,
        String name,
        ApplianceCategory category,
        Double ratedPowerWatts,
        Double dailyUsageHours,
        Double standbyPowerWatts,
        String location,
        Double estimatedMonthlyKWh,
        Double estimatedMonthlyCostINR,
        Instant createdAt
) {
    public static ApplianceResponse from(ApplianceProfile a, Double tariff) {
        double monthlyKWh = ((a.getRatedPowerWatts() * a.getDailyUsageHours()) + (a.getStandbyPowerWatts() != null ? a.getStandbyPowerWatts() * Math.max(0, 24 - a.getDailyUsageHours()) : 0.0)) * 30.0 / 1000.0;
        double cost = monthlyKWh * (tariff != null ? tariff : 7.50);
        return new ApplianceResponse(
                a.getId(),
                a.getUser() != null ? a.getUser().getId() : null,
                a.getName(),
                a.getCategory(),
                a.getRatedPowerWatts(),
                a.getDailyUsageHours(),
                a.getStandbyPowerWatts(),
                a.getLocation(),
                Math.round(monthlyKWh * 100.0) / 100.0,
                Math.round(cost * 100.0) / 100.0,
                a.getCreatedAt()
        );
    }
}
