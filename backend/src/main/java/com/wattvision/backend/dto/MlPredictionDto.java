package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public record MlPredictionDto(
        @JsonProperty("timestamp")
        Instant timestamp,

        @JsonProperty("consumption_kwh")
        Double consumptionKWh,

        @JsonProperty("anomaly_score")
        Double anomalyScore,

        @JsonProperty("is_anomaly")
        Boolean isAnomaly,

        @JsonProperty("severity")
        String severity,

        @JsonProperty("reason")
        String reason
) {}
