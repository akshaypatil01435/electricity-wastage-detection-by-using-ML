package com.wattvision.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "consumption_records", indexes = {
        @Index(name = "idx_consumption_user_time", columnList = "user_id, timestamp"),
        @Index(name = "idx_consumption_processed", columnList = "processed")
})
public class ConsumptionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Instant timestamp;

    @Column(name = "consumption_kwh", nullable = false)
    private Double consumptionKWh;

    @Column(nullable = false, length = 50)
    private String source = "SIMULATED";

    @Column(nullable = false)
    private boolean processed = false;

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
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public Double getConsumptionKWh() { return consumptionKWh; }
    public void setConsumptionKWh(Double consumptionKWh) { this.consumptionKWh = consumptionKWh; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public boolean isProcessed() { return processed; }
    public void setProcessed(boolean processed) { this.processed = processed; }
    public Instant getCreatedAt() { return createdAt; }
}
