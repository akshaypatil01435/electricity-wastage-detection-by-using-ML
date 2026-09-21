package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MlPredictResponse(
        @JsonProperty("model_version")
        String modelVersion,

        @JsonProperty("threshold")
        Double threshold,

        @JsonProperty("total")
        Integer total,

        @JsonProperty("anomalies")
        Integer anomalies,

        @JsonProperty("predictions")
        List<MlPredictionDto> predictions
) {}
