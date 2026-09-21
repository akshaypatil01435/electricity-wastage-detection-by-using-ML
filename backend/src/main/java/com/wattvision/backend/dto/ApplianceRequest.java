package com.wattvision.backend.dto;

import com.wattvision.backend.entity.ApplianceCategory;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplianceRequest(
        @NotBlank(message = "Appliance name is required")
        @Size(max = 100, message = "Appliance name cannot exceed 100 characters")
        String name,

        @NotNull(message = "Appliance category is required")
        ApplianceCategory category,

        @NotNull(message = "Rated power (Watts) is required")
        @DecimalMin(value = "0.1", message = "Rated power must be greater than zero")
        @DecimalMax(value = "50000.0", message = "Rated power exceeds maximum limit")
        Double ratedPowerWatts,

        @NotNull(message = "Daily usage hours is required")
        @DecimalMin(value = "0.0", message = "Daily usage hours cannot be negative")
        @DecimalMax(value = "24.0", message = "Daily usage hours cannot exceed 24")
        Double dailyUsageHours,

        @DecimalMin(value = "0.0", message = "Standby power cannot be negative")
        Double standbyPowerWatts,

        @Size(max = 100, message = "Location cannot exceed 100 characters")
        String location
) {}
