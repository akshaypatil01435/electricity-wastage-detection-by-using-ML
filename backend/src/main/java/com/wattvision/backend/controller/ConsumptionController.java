package com.wattvision.backend.controller;

import com.wattvision.backend.dto.*;
import com.wattvision.backend.service.ConsumptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/consumption")
@Tag(name = "Consumption", description = "Electricity consumption data ingestion and analytics")
public class ConsumptionController {

    private final ConsumptionService consumptionService;

    public ConsumptionController(ConsumptionService consumptionService) {
        this.consumptionService = consumptionService;
    }

    @GetMapping("/records")
    @Operation(summary = "Get paginated consumption records for the current authenticated user")
    public Page<ConsumptionRecordResponse> getRecords(
            Authentication authentication,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = "asc".equalsIgnoreCase(direction)
                ? Sort.by("timestamp").ascending()
                : Sort.by("timestamp").descending();

        return consumptionService.getRecords(authentication.getName(), start, end, PageRequest.of(page, Math.min(size, 200), sort));
    }

    @PostMapping("/records")
    @Operation(summary = "Ingest a single digital consumption reading and run ML inference")
    public ResponseEntity<ConsumptionRecordResponse> createRecord(
            Authentication authentication,
            @Valid @RequestBody ConsumptionRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consumptionService.createRecord(authentication.getName(), request));
    }

    @PostMapping("/batch")
    @Operation(summary = "Ingest a batch of digital consumption readings (e.g. from simulator stream)")
    public ResponseEntity<List<ConsumptionRecordResponse>> createBatch(
            Authentication authentication,
            @Valid @RequestBody ConsumptionBatchRequest batchRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consumptionService.createBatch(authentication.getName(), batchRequest));
    }

    @PostMapping(value = "/upload-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a CSV consumption file and auto-score anomalies with ML")
    public ResponseEntity<List<ConsumptionRecordResponse>> uploadCsv(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consumptionService.uploadCsv(authentication.getName(), file));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get overall consumption statistics, goal progress and cost summary")
    public ConsumptionSummaryResponse getSummary(Authentication authentication) {
        return consumptionService.getSummary(authentication.getName());
    }

    @GetMapping("/aggregates")
    @Operation(summary = "Get aggregated consumption time-series for chart rendering (day, week, month)")
    public List<ConsumptionAggregatePoint> getAggregates(
            Authentication authentication,
            @RequestParam(defaultValue = "day") String interval) {
        return consumptionService.getAggregates(authentication.getName(), interval);
    }
}
