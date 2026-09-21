package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record MlReadingDto(
        @JsonProperty("timestamp")
        Instant timestamp,

        @JsonProperty("consumption_kwh")
        Double consumptionKWh
) {}
