package com.wattvision.backend.dto;

import com.wattvision.backend.entity.Role;

public record AdminUserUpdateRequest(
        Boolean active,
        Role role,
        Double monthlyGoalKWh,
        Double electricityTariff
) {}
