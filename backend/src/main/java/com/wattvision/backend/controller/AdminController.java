package com.wattvision.backend.controller;

import com.wattvision.backend.dto.*;
import com.wattvision.backend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Console", description = "Enterprise administration, user management, audit logs, and ML model ops")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "List all registered system users (Admin only)")
    public Page<UserResponse> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return adminService.listUsers(PageRequest.of(page, size));
    }

    @PatchMapping("/users/{userId}")
    @Operation(summary = "Update user status, role, or energy goals (Admin only)")
    public UserResponse updateUser(
            Authentication authentication,
            @PathVariable Long userId,
            @RequestBody AdminUserUpdateRequest request) {
        return adminService.updateUser(userId, request, authentication.getName());
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get system-wide fleet analytics and health scores (Admin only)")
    public AdminAnalyticsResponse getAnalytics() {
        return adminService.getAnalytics();
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "Get system security and operational audit logs (Admin only)")
    public Page<AuditLogResponse> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return adminService.getAuditLogs(PageRequest.of(page, size));
    }

    @GetMapping("/ml-model")
    @Operation(summary = "Get active ML Isolation Forest model metadata and thresholds (Admin only)")
    public Map<String, Object> getMlModelInfo() {
        return adminService.getMlModelInfo();
    }

    @PostMapping("/ml-model/retrain")
    @Operation(summary = "Trigger retraining of the Isolation Forest model on synthetic/historical data (Admin only)")
    public MlTrainResponse retrainMlModel(
            Authentication authentication,
            @RequestBody(required = false) MlTrainRequest request) {
        return adminService.triggerMlRetrain(request, authentication.getName());
    }
}
