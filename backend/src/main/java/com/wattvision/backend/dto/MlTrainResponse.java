package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record MlTrainResponse(
        @JsonProperty("model_version")
        String modelVersion,

        @JsonProperty("trained_rows")
        Integer trainedRows,

        @JsonProperty("threshold")
        Double threshold,

        @JsonProperty("metrics")
        Map<String, Object> metrics,

        @JsonProperty("message")
        String message
) {}
