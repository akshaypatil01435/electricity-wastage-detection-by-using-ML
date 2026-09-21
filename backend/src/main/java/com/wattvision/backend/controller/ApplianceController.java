package com.wattvision.backend.controller;

import com.wattvision.backend.dto.ApplianceBreakdownResponse;
import com.wattvision.backend.dto.ApplianceRequest;
import com.wattvision.backend.dto.ApplianceResponse;
import com.wattvision.backend.service.ApplianceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appliances")
@Tag(name = "Appliances", description = "User appliance load profiles and consumption disaggregation")
public class ApplianceController {

    private final ApplianceService applianceService;

    public ApplianceController(ApplianceService applianceService) {
        this.applianceService = applianceService;
    }

    @GetMapping
    @Operation(summary = "List all configured appliance profiles for the current user")
    public List<ApplianceResponse> getAppliances(Authentication authentication) {
        return applianceService.getAppliances(authentication.getName());
    }

    @PostMapping
    @Operation(summary = "Add a new appliance profile")
    public ResponseEntity<ApplianceResponse> createAppliance(
            Authentication authentication,
            @Valid @RequestBody ApplianceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applianceService.createAppliance(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing appliance profile")
    public ApplianceResponse updateAppliance(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ApplianceRequest request) {
        return applianceService.updateAppliance(authentication.getName(), id, request);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an appliance profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAppliance(Authentication authentication, @PathVariable Long id) {
        applianceService.deleteAppliance(authentication.getName(), id);
    }

    @GetMapping("/breakdown")
    @Operation(summary = "Get appliance-level consumption breakdown percentages and estimated monthly cost")
    public List<ApplianceBreakdownResponse> getBreakdown(Authentication authentication) {
        return applianceService.getBreakdown(authentication.getName());
    }
}
