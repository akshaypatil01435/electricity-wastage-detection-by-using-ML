package com.wattvision.backend.service;

import com.wattvision.backend.dto.AlertResponse;
import com.wattvision.backend.entity.*;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.AlertRepository;
import com.wattvision.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    public AlertService(AlertRepository alertRepository, UserRepository userRepository) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlertResponse> getUserAlerts(String email, Pageable pageable) {
        User user = getUser(email);
        return alertRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(AlertResponse::from);
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(String email) {
        User user = getUser(email);
        return alertRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public AlertResponse markAsRead(String email, Long alertId) {
        User user = getUser(email);
        Alert alert = alertRepository.findByIdAndUserId(alertId, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Alert not found"));
        alert.setRead(true);
        return AlertResponse.from(alertRepository.save(alert));
    }

    @Transactional
    public int markAllAsRead(String email) {
        User user = getUser(email);
        return alertRepository.markAllAsReadByUserId(user.getId());
    }

    @Transactional
    public Alert createAlertForAnomaly(User user, WastageEvent event) {
        Alert alert = new Alert();
        alert.setUser(user);
        alert.setWastageEventId(event.getId());
        AlertType type = event.getSeverity() == WastageSeverity.CRITICAL ? AlertType.CRITICAL : AlertType.WARNING;
        alert.setType(type);
        alert.setTitle("Abnormal Electricity Consumption (" + event.getSeverity() + ")");
        alert.setMessage(String.format("Anomaly detected at %s: %.2f kWh (Score: %.2f). %s",
                event.getTimestamp(), event.getConsumptionKWh(), event.getAnomalyScore(), event.getReason()));
        return alertRepository.save(alert);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
