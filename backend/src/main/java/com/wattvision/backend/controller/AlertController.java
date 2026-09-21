package com.wattvision.backend.controller;

import com.wattvision.backend.dto.AlertResponse;
import com.wattvision.backend.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "User alert notifications and warning center")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    @Operation(summary = "Get paginated alerts for the current user")
    public Page<AlertResponse> getAlerts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return alertService.getUserAlerts(authentication.getName(), PageRequest.of(page, size));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread alert notifications")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        return Map.of("unreadCount", alertService.getUnreadCount(authentication.getName()));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark an individual alert as read")
    public AlertResponse markAsRead(Authentication authentication, @PathVariable Long id) {
        return alertService.markAsRead(authentication.getName(), id);
    }

    @PostMapping("/mark-all-read")
    @Operation(summary = "Mark all alert notifications as read")
    public Map<String, Object> markAllRead(Authentication authentication) {
        int updated = alertService.markAllAsRead(authentication.getName());
        return Map.of("success", true, "updatedCount", updated);
    }
}
