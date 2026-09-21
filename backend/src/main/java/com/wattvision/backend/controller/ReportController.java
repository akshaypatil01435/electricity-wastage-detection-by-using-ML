package com.wattvision.backend.controller;

import com.wattvision.backend.dto.ReportGenerateRequest;
import com.wattvision.backend.dto.ReportResponse;
import com.wattvision.backend.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Periodic energy audit reports and export generation")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    @Operation(summary = "Get list of generated energy reports for the current user")
    public Page<ReportResponse> getReports(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return reportService.getReports(authentication.getName(), PageRequest.of(page, size));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a new energy audit report for a specified date range")
    public ResponseEntity<ReportResponse> generateReport(
            Authentication authentication,
            @Valid @RequestBody ReportGenerateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportService.generateReport(authentication.getName(), request));
    }

    @GetMapping("/{id}/export-csv")
    @Operation(summary = "Download a generated report in CSV format")
    public ResponseEntity<String> exportCsv(Authentication authentication, @PathVariable Long id) {
        String csv = reportService.exportCsv(authentication.getName(), id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"report-" + id + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
