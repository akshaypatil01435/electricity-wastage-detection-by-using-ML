package com.wattvision.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ConsumptionBatchRequest(
        @NotEmpty(message = "Readings batch cannot be empty")
        @Size(max = 20000, message = "At most 20,000 readings per batch")
        List<@Valid ConsumptionRecordRequest> records
) {}
