package com.wattvision.backend.service;

import com.wattvision.backend.dto.WastageEventResponse;
import com.wattvision.backend.dto.WastageEventUpdateRequest;
import com.wattvision.backend.dto.WastageSummaryResponse;
import com.wattvision.backend.entity.*;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.UserRepository;
import com.wattvision.backend.repository.WastageEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class WastageService {

    private final WastageEventRepository wastageEventRepository;
    private final UserRepository userRepository;
    private final AlertService alertService;
    private final AuditService auditService;

    public WastageService(WastageEventRepository wastageEventRepository,
                          UserRepository userRepository,
                          AlertService alertService,
                          AuditService auditService) {
        this.wastageEventRepository = wastageEventRepository;
        this.userRepository = userRepository;
        this.alertService = alertService;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<WastageEventResponse> getEvents(String email, WastageStatus status, WastageSeverity severity, Pageable pageable) {
        User user = getUser(email);
        if (status != null) {
            return wastageEventRepository.findByUserIdAndStatus(user.getId(), status, pageable)
                    .map(WastageEventResponse::from);
        }
        if (severity != null) {
            return wastageEventRepository.findByUserIdAndSeverity(user.getId(), severity, pageable)
                    .map(WastageEventResponse::from);
        }
        return wastageEventRepository.findByUserId(user.getId(), pageable)
                .map(WastageEventResponse::from);
    }

    @Transactional(readOnly = true)
    public WastageEventResponse getEvent(String email, Long id) {
        User user = getUser(email);
        WastageEvent event = wastageEventRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Wastage event not found"));
        return WastageEventResponse.from(event);
    }

    @Transactional
    public WastageEventResponse updateEvent(String email, Long id, WastageEventUpdateRequest request) {
        User user = getUser(email);
        WastageEvent event = wastageEventRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Wastage event not found"));

        event.setStatus(request.status());
        if (request.resolutionNote() != null) {
            event.setResolutionNote(request.resolutionNote().trim());
        }
        if (request.status() == WastageStatus.RESOLVED || request.status() == WastageStatus.DISMISSED) {
            event.setResolvedAt(Instant.now());
        }
        WastageEvent saved = wastageEventRepository.save(event);
        auditService.record(user.getEmail(), user.getRole().name(), "UPDATE_WASTAGE_EVENT",
                "WastageEvent #" + id, "Updated status to " + request.status(), null);
        return WastageEventResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public WastageSummaryResponse getSummary(String email) {
        User user = getUser(email);
        Long total = wastageEventRepository.countByUserId(user.getId());
        Long unresolved = wastageEventRepository.countByUserIdAndStatus(user.getId(), WastageStatus.UNRESOLVED);
        Long resolved = wastageEventRepository.countByUserIdAndStatus(user.getId(), WastageStatus.RESOLVED);
        Double totalWastageKWh = wastageEventRepository.sumWastageKWhByUserId(user.getId());
        double wastageKWh = totalWastageKWh != null ? totalWastageKWh : 0.0;
        double tariff = user.getElectricityTariff() != null ? user.getElectricityTariff() : 7.50;
        double lossINR = wastageKWh * tariff;
        double potentialSavings = lossINR * 0.75; // 75% estimated reclaimable with recommendations

        return new WastageSummaryResponse(
                total,
                unresolved,
                resolved,
                0L, // critical count computed if needed
                Math.round(wastageKWh * 100.0) / 100.0,
                Math.round(lossINR * 100.0) / 100.0,
                Math.round(potentialSavings * 100.0) / 100.0
        );
    }

    @Transactional
    public WastageEvent recordAnomaly(User user, Long recordId, Instant timestamp, Double consumption,
                                      Double baseline, Double score, WastageSeverity severity,
                                      String reason, String recommendation) {
        WastageEvent event = new WastageEvent();
        event.setUser(user);
        event.setConsumptionRecordId(recordId);
        event.setTimestamp(timestamp);
        event.setConsumptionKWh(consumption);
        event.setExpectedBaselineKWh(baseline != null ? baseline : Math.max(0.1, consumption * 0.5));
        event.setAnomalyScore(score);
        event.setSeverity(severity != null ? severity : WastageSeverity.MEDIUM);
        event.setReason(reason != null ? reason : "Abnormal pattern detected by Isolation Forest model");
        event.setRecommendation(recommendation != null ? recommendation : "Check active appliances and high-draw equipment during this period.");
        event.setStatus(WastageStatus.UNRESOLVED);

        WastageEvent saved = wastageEventRepository.save(event);
        if (severity == WastageSeverity.HIGH || severity == WastageSeverity.CRITICAL) {
            alertService.createAlertForAnomaly(user, saved);
        }
        return saved;
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
