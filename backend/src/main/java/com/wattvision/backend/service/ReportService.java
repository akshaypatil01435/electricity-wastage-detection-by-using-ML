package com.wattvision.backend.service;

import com.wattvision.backend.dto.ReportGenerateRequest;
import com.wattvision.backend.dto.ReportResponse;
import com.wattvision.backend.entity.ConsumptionRecord;
import com.wattvision.backend.entity.Report;
import com.wattvision.backend.entity.User;
import com.wattvision.backend.entity.WastageEvent;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.ConsumptionRecordRepository;
import com.wattvision.backend.repository.ReportRepository;
import com.wattvision.backend.repository.UserRepository;
import com.wattvision.backend.repository.WastageEventRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final ConsumptionRecordRepository consumptionRepository;
    private final WastageEventRepository wastageRepository;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         ConsumptionRecordRepository consumptionRepository,
                         WastageEventRepository wastageRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.consumptionRepository = consumptionRepository;
        this.wastageRepository = wastageRepository;
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReports(String email, Pageable pageable) {
        User user = getUser(email);
        return reportRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(ReportResponse::from);
    }

    @Transactional
    public ReportResponse generateReport(String email, ReportGenerateRequest req) {
        User user = getUser(email);
        Instant start = req.startDate().atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant end = req.endDate().plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        List<ConsumptionRecord> records = consumptionRepository.findByUserIdAndTimestampBetweenOrderByTimestampAsc(user.getId(), start, end);
        List<WastageEvent> events = wastageRepository.findByUserIdAndTimestampBetweenOrderByTimestampDesc(user.getId(), start, end);

        double totalKWh = records.stream().mapToDouble(ConsumptionRecord::getConsumptionKWh).sum();
        double wastageKWh = events.stream().mapToDouble(e -> Math.max(0.0, e.getConsumptionKWh() - e.getExpectedBaselineKWh())).sum();
        double tariff = user.getElectricityTariff() != null ? user.getElectricityTariff() : 7.50;
        double cost = totalKWh * tariff;
        double potentialSavings = wastageKWh * tariff;

        Report report = new Report();
        report.setUser(user);
        report.setTitle(req.title() != null && !req.title().isBlank()
                ? req.title().trim()
                : "Energy Audit Report (" + req.startDate() + " to " + req.endDate() + ")");
        report.setReportType(req.reportType());
        report.setStartDate(req.startDate());
        report.setEndDate(req.endDate());
        report.setTotalConsumptionKWh(Math.round(totalKWh * 100.0) / 100.0);
        report.setEstimatedWastageKWh(Math.round(wastageKWh * 100.0) / 100.0);
        report.setEstimatedCostINR(Math.round(cost * 100.0) / 100.0);
        report.setPotentialSavingsINR(Math.round(potentialSavings * 100.0) / 100.0);
        report.setAnomaliesCount(events.size());
        report.setSummaryNotes(req.summaryNotes() != null ? req.summaryNotes() : "Automated ML energy efficiency audit report.");

        Report saved = reportRepository.save(report);
        return ReportResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public String exportCsv(String email, Long reportId) {
        User user = getUser(email);
        Report report = reportRepository.findByIdAndUserId(reportId, user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Report not found"));

        StringBuilder sb = new StringBuilder();
        sb.append("WattVision AI - Energy Audit Report\n");
        sb.append("Title,").append(report.getTitle()).append("\n");
        sb.append("Report Type,").append(report.getReportType()).append("\n");
        sb.append("Start Date,").append(report.getStartDate()).append("\n");
        sb.append("End Date,").append(report.getEndDate()).append("\n");
        sb.append("Total Consumption (kWh),").append(report.getTotalConsumptionKWh()).append("\n");
        sb.append("Estimated Wastage (kWh),").append(report.getEstimatedWastageKWh()).append("\n");
        sb.append("Estimated Cost (INR),").append(report.getEstimatedCostINR()).append("\n");
        sb.append("Potential Savings (INR),").append(report.getPotentialSavingsINR()).append("\n");
        sb.append("Anomalies Count,").append(report.getAnomaliesCount()).append("\n");
        sb.append("Summary Notes,\"").append(report.getSummaryNotes().replace("\"", "\"\"")).append("\"\n");
        return sb.toString();
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
