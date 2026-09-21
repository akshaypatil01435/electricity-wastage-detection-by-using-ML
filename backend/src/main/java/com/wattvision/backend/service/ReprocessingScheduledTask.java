package com.wattvision.backend.service;

import com.wattvision.backend.entity.ConsumptionRecord;
import com.wattvision.backend.repository.ConsumptionRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class ReprocessingScheduledTask {

    private static final Logger log = LoggerFactory.getLogger(ReprocessingScheduledTask.class);

    private final ConsumptionRecordRepository consumptionRepository;
    private final ConsumptionService consumptionService;
    private final MlInferenceClient mlClient;

    public ReprocessingScheduledTask(ConsumptionRecordRepository consumptionRepository,
                                     ConsumptionService consumptionService,
                                     MlInferenceClient mlClient) {
        this.consumptionRepository = consumptionRepository;
        this.consumptionService = consumptionService;
        this.mlClient = mlClient;
    }

    /**
     * Periodically checks for unprocessed consumption records (e.g. ingested while ML service was temporarily restarting)
     * and processes them in batches.
     */
    @Scheduled(fixedDelay = 60000)
    public void reprocessPendingRecords() {
        if (!mlClient.isHealthy()) {
            return;
        }
        List<ConsumptionRecord> pending = consumptionRepository.findTop500ByProcessedFalseOrderByTimestampAsc();
        if (pending.isEmpty()) {
            return;
        }
        log.info("Reprocessing {} pending un-scored consumption records with ML microservice...", pending.size());

        // Group by user
        Map<Long, List<ConsumptionRecord>> byUser = pending.stream()
                .collect(Collectors.groupingBy(r -> r.getUser().getId()));

        for (List<ConsumptionRecord> userRecords : byUser.values()) {
            if (!userRecords.isEmpty()) {
                consumptionService.processWithMl(userRecords.get(0).getUser(), userRecords);
            }
        }
    }
}
