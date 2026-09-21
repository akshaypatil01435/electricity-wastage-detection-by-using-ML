package com.wattvision.backend.service;

import com.wattvision.backend.dto.*;
import com.wattvision.backend.entity.Role;
import com.wattvision.backend.entity.User;
import com.wattvision.backend.entity.WastageStatus;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.AuditLogRepository;
import com.wattvision.backend.repository.ConsumptionRecordRepository;
import com.wattvision.backend.repository.UserRepository;
import com.wattvision.backend.repository.WastageEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ConsumptionRecordRepository consumptionRepository;
    private final WastageEventRepository wastageRepository;
    private final AuditLogRepository auditLogRepository;
    private final MlInferenceClient mlClient;
    private final AuditService auditService;

    public AdminService(UserRepository userRepository,
                        ConsumptionRecordRepository consumptionRepository,
                        WastageEventRepository wastageRepository,
                        AuditLogRepository auditLogRepository,
                        MlInferenceClient mlClient,
                        AuditService auditService) {
        this.userRepository = userRepository;
        this.consumptionRepository = consumptionRepository;
        this.wastageRepository = wastageRepository;
        this.auditLogRepository = auditLogRepository;
        this.mlClient = mlClient;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> listUsers(Pageable pageable) {
        return userRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(UserResponse::from);
    }

    @Transactional
    public UserResponse updateUser(Long userId, AdminUserUpdateRequest req, String adminEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (req.active() != null) {
            user.setActive(req.active());
        }
        if (req.role() != null) {
            user.setRole(req.role());
        }
        if (req.monthlyGoalKWh() != null) {
            user.setMonthlyGoalKWh(req.monthlyGoalKWh());
        }
        if (req.electricityTariff() != null) {
            user.setElectricityTariff(req.electricityTariff());
        }

        User saved = userRepository.save(user);
        auditService.record(adminEmail, "ADMIN", "UPDATE_USER", "User #" + userId,
                "Updated user state: active=" + req.active() + ", role=" + req.role(), null);
        return UserResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActiveTrue();
        long adminCount = userRepository.countByRole(Role.ADMIN);
        long totalRecords = consumptionRepository.count();
        long totalWastage = wastageRepository.count();
        long unresolvedWastage = wastageRepository.countByUserIdAndStatus(null, WastageStatus.UNRESOLVED);

        double totalKWh = consumptionRepository.findAll().stream().mapToDouble(c -> c.getConsumptionKWh()).sum();
        double wastageKWh = wastageRepository.findAll().stream().mapToDouble(w -> Math.max(0.0, w.getConsumptionKWh() - w.getExpectedBaselineKWh())).sum();
        double estimatedLossINR = wastageKWh * 7.50;

        double healthScore = totalRecords > 0 ? Math.max(0.0, 100.0 - ((double) totalWastage / (double) totalRecords * 100.0)) : 100.0;

        return new AdminAnalyticsResponse(
                totalUsers,
                activeUsers,
                adminCount,
                totalRecords,
                Math.round(totalKWh * 100.0) / 100.0,
                totalWastage,
                unresolvedWastage,
                Math.round(wastageKWh * 100.0) / 100.0,
                Math.round(estimatedLossINR * 100.0) / 100.0,
                Math.round(healthScore * 10.0) / 10.0
        );
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(AuditLogResponse::from);
    }

    public Map<String, Object> getMlModelInfo() {
        return mlClient.getModelInfo()
                .orElse(Map.of(
                        "algorithm", "IsolationForest",
                        "status", "DEGRADED",
                        "model_version", "local-fallback-v1.0",
                        "features", java.util.List.of("hour_sin", "hour_cos", "is_weekend", "is_night", "consumption_kwh", "rolling_mean_3h", "rolling_std_24h", "delta_prev", "ratio_to_24h_mean")
                ));
    }

    public MlTrainResponse triggerMlRetrain(MlTrainRequest req, String adminEmail) {
        MlTrainResponse resp = mlClient.trainModel(req)
                .orElseThrow(() -> new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "ML microservice is currently unreachable"));
        auditService.record(adminEmail, "ADMIN", "RETRAIN_MODEL", "Isolation Forest Model",
                "Triggered retraining with seed=" + (req != null ? req.seed() : 42), null);
        return resp;
    }
}
