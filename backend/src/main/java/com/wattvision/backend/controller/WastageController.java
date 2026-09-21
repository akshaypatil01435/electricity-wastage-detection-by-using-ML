package com.wattvision.backend.controller;

import com.wattvision.backend.dto.WastageEventResponse;
import com.wattvision.backend.dto.WastageEventUpdateRequest;
import com.wattvision.backend.dto.WastageSummaryResponse;
import com.wattvision.backend.entity.WastageSeverity;
import com.wattvision.backend.entity.WastageStatus;
import com.wattvision.backend.service.WastageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wastage-events")
@Tag(name = "Wastage Events", description = "Machine Learning anomaly detections and event management")
public class WastageController {

    private final WastageService wastageService;

    public WastageController(WastageService wastageService) {
        this.wastageService = wastageService;
    }

    @GetMapping
    @Operation(summary = "Get list of flagged wastage anomalies with filtering by status or severity")
    public Page<WastageEventResponse> getEvents(
            Authentication authentication,
            @RequestParam(required = false) WastageStatus status,
            @RequestParam(required = false) WastageSeverity severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return wastageService.getEvents(authentication.getName(), status, severity,
                PageRequest.of(page, size, Sort.by("timestamp").descending()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed diagnostic information for a specific wastage event")
    public WastageEventResponse getEvent(Authentication authentication, @PathVariable Long id) {
        return wastageService.getEvent(authentication.getName(), id);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update resolution status and notes for a wastage event")
    public WastageEventResponse updateEvent(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody WastageEventUpdateRequest request) {
        return wastageService.updateEvent(authentication.getName(), id, request);
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Mark a wastage event as resolved")
    public WastageEventResponse resolveEvent(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Resolved via action recommendation") String note) {
        return wastageService.updateEvent(authentication.getName(), id,
                new WastageEventUpdateRequest(WastageStatus.RESOLVED, note));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get aggregate wastage metrics (unresolved count, total wasted kWh, estimated financial loss)")
    public WastageSummaryResponse getSummary(Authentication authentication) {
        return wastageService.getSummary(authentication.getName());
    }
}
