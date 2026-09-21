package com.wattvision.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record ConsumptionRecordRequest(
        @NotNull(message = "Timestamp is required")
        Instant timestamp,

        @NotNull(message = "Consumption (kWh) is required")
        @DecimalMin(value = "0.0", message = "Consumption cannot be negative")
        @DecimalMax(value = "1000.0", message = "Consumption exceeds maximum limit")
        Double consumptionKWh,

        String source
) {}
