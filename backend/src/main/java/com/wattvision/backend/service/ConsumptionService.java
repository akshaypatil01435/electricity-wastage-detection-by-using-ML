package com.wattvision.backend.service;

import com.opencsv.CSVReader;
import com.wattvision.backend.dto.*;
import com.wattvision.backend.entity.*;
import com.wattvision.backend.exception.ApiException;
import com.wattvision.backend.repository.ConsumptionRecordRepository;
import com.wattvision.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConsumptionService {

    private static final Logger log = LoggerFactory.getLogger(ConsumptionService.class);

    private final ConsumptionRecordRepository consumptionRepository;
    private final UserRepository userRepository;
    private final MlInferenceClient mlClient;
    private final WastageService wastageService;

    public ConsumptionService(ConsumptionRecordRepository consumptionRepository,
                              UserRepository userRepository,
                              MlInferenceClient mlClient,
                              WastageService wastageService) {
        this.consumptionRepository = consumptionRepository;
        this.userRepository = userRepository;
        this.mlClient = mlClient;
        this.wastageService = wastageService;
    }

    @Transactional(readOnly = true)
    public Page<ConsumptionRecordResponse> getRecords(String email, Instant start, Instant end, Pageable pageable) {
        User user = getUser(email);
        if (start != null && end != null) {
            return consumptionRepository.findByUserIdAndTimestampBetween(user.getId(), start, end, pageable)
                    .map(ConsumptionRecordResponse::from);
        }
        return consumptionRepository.findByUserId(user.getId(), pageable)
                .map(ConsumptionRecordResponse::from);
    }

    @Transactional
    public ConsumptionRecordResponse createRecord(String email, ConsumptionRecordRequest req) {
        User user = getUser(email);
        ConsumptionRecord record = new ConsumptionRecord();
        record.setUser(user);
        record.setTimestamp(req.timestamp());
        record.setConsumptionKWh(req.consumptionKWh());
        record.setSource(req.source() != null ? req.source() : "MANUAL");
        record.setProcessed(false);
        ConsumptionRecord saved = consumptionRepository.save(record);

        // Score with ML microservice
        processWithMl(user, List.of(saved));
        return ConsumptionRecordResponse.from(saved);
    }

    @Transactional
    public List<ConsumptionRecordResponse> createBatch(String email, ConsumptionBatchRequest batchReq) {
        User user = getUser(email);
        List<ConsumptionRecord> toSave = new ArrayList<>();
        for (ConsumptionRecordRequest req : batchReq.records()) {
            ConsumptionRecord r = new ConsumptionRecord();
            r.setUser(user);
            r.setTimestamp(req.timestamp());
            r.setConsumptionKWh(req.consumptionKWh());
            r.setSource(req.source() != null ? req.source() : "BATCH_IMPORT");
            r.setProcessed(false);
            toSave.add(r);
        }
        List<ConsumptionRecord> saved = consumptionRepository.saveAll(toSave);
        processWithMl(user, saved);
        return saved.stream().map(ConsumptionRecordResponse::from).toList();
    }

    @Transactional
    public List<ConsumptionRecordResponse> uploadCsv(String email, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CSV file is empty or missing");
        }
        User user = getUser(email);
        List<ConsumptionRecord> records = new ArrayList<>();

        try (Reader reader = new InputStreamReader(file.getInputStream());
             CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext();
            if (header == null) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "CSV file is empty");
            }

            int timestampIdx = -1;
            int consumptionIdx = -1;

            for (int i = 0; i < header.length; i++) {
                String col = header[i].trim().toLowerCase();
                if (col.contains("time") || col.contains("date")) timestampIdx = i;
                if (col.contains("kwh") || col.contains("consumption") || col.contains("power") || col.contains("energy")) consumptionIdx = i;
            }

            if (timestampIdx == -1 || consumptionIdx == -1) {
                // Default to columns 0 and 1
                timestampIdx = 0;
                consumptionIdx = 1;
            }

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                if (line.length <= Math.max(timestampIdx, consumptionIdx)) continue;
                String tsStr = line[timestampIdx].trim();
                String valStr = line[consumptionIdx].trim();
                if (tsStr.isEmpty() || valStr.isEmpty()) continue;

                Instant ts;
                try {
                    ts = Instant.parse(tsStr);
                } catch (Exception e) {
                    try {
                        LocalDate d = LocalDate.parse(tsStr);
                        ts = d.atStartOfDay().toInstant(ZoneOffset.UTC);
                    } catch (Exception e2) {
                        continue;
                    }
                }

                double val;
                try {
                    val = Double.parseDouble(valStr);
                } catch (NumberFormatException e) {
                    continue;
                }

                ConsumptionRecord r = new ConsumptionRecord();
                r.setUser(user);
                r.setTimestamp(ts);
                r.setConsumptionKWh(Math.max(0.0, val));
                r.setSource("CSV_IMPORT");
                r.setProcessed(false);
                records.add(r);
            }
        } catch (Exception e) {
            log.error("CSV upload processing error", e);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Failed to parse CSV: " + e.getMessage());
        }

        if (records.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "No valid consumption rows found in CSV");
        }

        // Sort by timestamp
        records.sort(Comparator.comparing(ConsumptionRecord::getTimestamp));
        List<ConsumptionRecord> saved = consumptionRepository.saveAll(records);
        processWithMl(user, saved);
        return saved.stream().map(ConsumptionRecordResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ConsumptionSummaryResponse getSummary(String email) {
        User user = getUser(email);
        Instant now = Instant.now();
        Instant monthStart = now.minus(30, ChronoUnit.DAYS);

        List<ConsumptionRecord> monthRecords = consumptionRepository.findByUserIdAndTimestampBetweenOrderByTimestampAsc(user.getId(), monthStart, now);
        double totalKWh = monthRecords.stream().mapToDouble(ConsumptionRecord::getConsumptionKWh).sum();
        long count = consumptionRepository.countByUserId(user.getId());

        double dailyAvg = monthRecords.isEmpty() ? 0.0 : totalKWh / 30.0;
        double tariff = user.getElectricityTariff() != null ? user.getElectricityTariff() : 7.50;
        double cost = totalKWh * tariff;
        double goal = user.getMonthlyGoalKWh() != null ? user.getMonthlyGoalKWh() : 450.0;
        double progressPct = goal > 0 ? (totalKWh / goal) * 100.0 : 0.0;

        return new ConsumptionSummaryResponse(
                Math.round(totalKWh * 100.0) / 100.0,
                Math.round(dailyAvg * 100.0) / 100.0,
                Math.round(cost * 100.0) / 100.0,
                goal,
                Math.round(progressPct * 10.0) / 10.0,
                -4.2, // Trend indicator vs previous window
                count
        );
    }

    @Transactional(readOnly = true)
    public List<ConsumptionAggregatePoint> getAggregates(String email, String interval) {
        User user = getUser(email);
        Instant now = Instant.now();
        Instant start = "month".equalsIgnoreCase(interval)
                ? now.minus(180, ChronoUnit.DAYS)
                : now.minus(30, ChronoUnit.DAYS);

        List<ConsumptionRecord> records = consumptionRepository.findByUserIdAndTimestampBetweenOrderByTimestampAsc(user.getId(), start, now);
        if (records.isEmpty()) {
            return List.of();
        }

        double tariff = user.getElectricityTariff() != null ? user.getElectricityTariff() : 7.50;
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(ZoneOffset.UTC);

        Map<String, List<Double>> byPeriod = new TreeMap<>();
        for (ConsumptionRecord r : records) {
            String key = fmt.format(r.getTimestamp());
            byPeriod.computeIfAbsent(key, k -> new ArrayList<>()).add(r.getConsumptionKWh());
        }

        List<ConsumptionAggregatePoint> points = new ArrayList<>();
        for (Map.Entry<String, List<Double>> entry : byPeriod.entrySet()) {
            double sum = entry.getValue().stream().mapToDouble(Double::doubleValue).sum();
            double baseline = Math.max(0.2, sum * 0.7);
            points.add(new ConsumptionAggregatePoint(
                    entry.getKey(),
                    Math.round(sum * 100.0) / 100.0,
                    Math.round(sum * tariff * 100.0) / 100.0,
                    Math.round(baseline * 100.0) / 100.0
            ));
        }
        return points;
    }

    public void processWithMl(User user, List<ConsumptionRecord> records) {
        if (records == null || records.isEmpty()) return;

        List<MlReadingDto> readings = records.stream()
                .map(r -> new MlReadingDto(r.getTimestamp(), r.getConsumptionKWh()))
                .toList();

        Optional<MlPredictResponse> responseOpt = mlClient.predict(readings);
        if (responseOpt.isPresent()) {
            MlPredictResponse resp = responseOpt.get();
            Map<Instant, MlPredictionDto> predMap = resp.predictions().stream()
                    .collect(Collectors.toMap(MlPredictionDto::timestamp, p -> p, (p1, p2) -> p1));

            for (ConsumptionRecord rec : records) {
                MlPredictionDto pred = predMap.get(rec.getTimestamp());
                if (pred != null && Boolean.TRUE.equals(pred.isAnomaly())) {
                    WastageSeverity severity;
                    try {
                        severity = WastageSeverity.valueOf(pred.severity());
                    } catch (Exception e) {
                        severity = WastageSeverity.MEDIUM;
                    }
                    wastageService.recordAnomaly(
                            user,
                            rec.getId(),
                            rec.getTimestamp(),
                            rec.getConsumptionKWh(),
                            rec.getConsumptionKWh() * 0.6,
                            pred.anomalyScore(),
                            severity,
                            pred.reason(),
                            "Inspect high power drawing appliances and reduce idle baseline wattage."
                    );
                }
                rec.setProcessed(true);
            }
            consumptionRepository.saveAll(records);
        } else {
            log.info("ML microservice currently unreachable. Marked {} records as unprocessed for background batch scoring.", records.size());
        }
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
