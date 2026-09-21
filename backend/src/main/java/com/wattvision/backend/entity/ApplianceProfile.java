package com.wattvision.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "appliance_profiles", indexes = {
        @Index(name = "idx_appliance_user", columnList = "user_id")
})
public class ApplianceProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplianceCategory category = ApplianceCategory.OTHER;

    @Column(name = "rated_power_watts", nullable = false)
    private Double ratedPowerWatts;

    @Column(name = "daily_usage_hours", nullable = false)
    private Double dailyUsageHours;

    @Column(name = "standby_power_watts", nullable = false)
    private Double standbyPowerWatts = 0.0;

    @Column(length = 100)
    private String location;

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
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ApplianceCategory getCategory() { return category; }
    public void setCategory(ApplianceCategory category) { this.category = category; }
    public Double getRatedPowerWatts() { return ratedPowerWatts; }
    public void setRatedPowerWatts(Double ratedPowerWatts) { this.ratedPowerWatts = ratedPowerWatts; }
    public Double getDailyUsageHours() { return dailyUsageHours; }
    public void setDailyUsageHours(Double dailyUsageHours) { this.dailyUsageHours = dailyUsageHours; }
    public Double getStandbyPowerWatts() { return standbyPowerWatts; }
    public void setStandbyPowerWatts(Double standbyPowerWatts) { this.standbyPowerWatts = standbyPowerWatts; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Instant getCreatedAt() { return createdAt; }
}
