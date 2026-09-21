package com.wattvision.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record MlTrainRequest(
        @JsonProperty("n_households")
        Integer nHouseholds,

        @JsonProperty("days")
        Integer days,

        @JsonProperty("contamination")
        Double contamination,

        @JsonProperty("n_estimators")
        Integer nEstimators,

        @JsonProperty("seed")
        Integer seed
) {}
