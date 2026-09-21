package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record MlPredictRequest(
        @JsonProperty("readings")
        List<MlReadingDto> readings
) {}
