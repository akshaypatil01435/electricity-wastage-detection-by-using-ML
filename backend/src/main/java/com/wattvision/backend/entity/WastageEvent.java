package com.wattvision.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "wastage_events", indexes = {
        @Index(name = "idx_wastage_user_time", columnList = "user_id, timestamp"),
        @Index(name = "idx_wastage_status", columnList = "status")
})
public class WastageEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "consumption_record_id")
    private Long consumptionRecordId;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(name = "consumption_kwh", nullable = false)
    private Double consumptionKWh;

    @Column(name = "expected_baseline_kwh", nullable = false)
    private Double expectedBaselineKWh = 0.0;

    @Column(name = "anomaly_score", nullable = false)
    private Double anomalyScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WastageSeverity severity = WastageSeverity.MEDIUM;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(length = 500)
    private String recommendation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WastageStatus status = WastageStatus.UNRESOLVED;

    @Column(name = "resolution_note", columnDefinition = "TEXT")
    private String resolutionNote;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Long getConsumptionRecordId() { return consumptionRecordId; }
    public void setConsumptionRecordId(Long consumptionRecordId) { this.consumptionRecordId = consumptionRecordId; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public Double getConsumptionKWh() { return consumptionKWh; }
    public void setConsumptionKWh(Double consumptionKWh) { this.consumptionKWh = consumptionKWh; }
    public Double getExpectedBaselineKWh() { return expectedBaselineKWh; }
    public void setExpectedBaselineKWh(Double expectedBaselineKWh) { this.expectedBaselineKWh = expectedBaselineKWh; }
    public Double getAnomalyScore() { return anomalyScore; }
    public void setAnomalyScore(Double anomalyScore) { this.anomalyScore = anomalyScore; }
    public WastageSeverity getSeverity() { return severity; }
    public void setSeverity(WastageSeverity severity) { this.severity = severity; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public WastageStatus getStatus() { return status; }
    public void setStatus(WastageStatus status) { this.status = status; }
    public String getResolutionNote() { return resolutionNote; }
    public void setResolutionNote(String resolutionNote) { this.resolutionNote = resolutionNote; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
