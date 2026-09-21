package com.wattvision.backend.dto;

import com.wattvision.backend.entity.WastageStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record WastageEventUpdateRequest(
        @NotNull(message = "Status is required")
        WastageStatus status,

        @Size(max = 2000, message = "Resolution note cannot exceed 2000 characters")
        String resolutionNote
) {}
