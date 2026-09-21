package com.wattvision.backend.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "reports", indexes = {
        @Index(name = "idx_report_user_time", columnList = "user_id, created_at")
})
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 50)
    private ReportType reportType = ReportType.MONTHLY;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_consumption_kwh", nullable = false)
    private Double totalConsumptionKWh = 0.0;

    @Column(name = "estimated_wastage_kwh", nullable = false)
    private Double estimatedWastageKWh = 0.0;

    @Column(name = "estimated_cost_inr", nullable = false)
    private Double estimatedCostINR = 0.0;

    @Column(name = "potential_savings_inr", nullable = false)
    private Double potentialSavingsINR = 0.0;

    @Column(name = "anomalies_count", nullable = false)
    private Integer anomaliesCount = 0;

    @Column(name = "summary_notes", columnDefinition = "TEXT")
    private String summaryNotes;

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
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ReportType getReportType() { return reportType; }
    public void setReportType(ReportType reportType) { this.reportType = reportType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Double getTotalConsumptionKWh() { return totalConsumptionKWh; }
    public void setTotalConsumptionKWh(Double totalConsumptionKWh) { this.totalConsumptionKWh = totalConsumptionKWh; }
    public Double getEstimatedWastageKWh() { return estimatedWastageKWh; }
    public void setEstimatedWastageKWh(Double estimatedWastageKWh) { this.estimatedWastageKWh = estimatedWastageKWh; }
    public Double getEstimatedCostINR() { return estimatedCostINR; }
    public void setEstimatedCostINR(Double estimatedCostINR) { this.estimatedCostINR = estimatedCostINR; }
    public Double getPotentialSavingsINR() { return potentialSavingsINR; }
    public void setPotentialSavingsINR(Double potentialSavingsINR) { this.potentialSavingsINR = potentialSavingsINR; }
    public Integer getAnomaliesCount() { return anomaliesCount; }
    public void setAnomaliesCount(Integer anomaliesCount) { this.anomaliesCount = anomaliesCount; }
    public String getSummaryNotes() { return summaryNotes; }
    public void setSummaryNotes(String summaryNotes) { this.summaryNotes = summaryNotes; }
    public Instant getCreatedAt() { return createdAt; }
}
