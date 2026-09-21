package com.wattvision.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wattvision.backend.dto.ConsumptionBatchRequest;
import com.wattvision.backend.dto.ConsumptionRecordRequest;
import com.wattvision.backend.dto.LoginRequest;
import com.wattvision.backend.dto.RegisterRequest;
import com.wattvision.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ConsumptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    private String token;
    private String email;

    @BeforeEach
    void setUp() {
        email = "consump-" + UUID.randomUUID() + "@example.com";
        authService.register(new RegisterRequest("Consumption User", email, "password123"));
        token = authService.login(new LoginRequest(email, "password123")).token();
    }

    @Test
    void createAndGetConsumptionRecord() throws Exception {
        ConsumptionRecordRequest req = new ConsumptionRecordRequest(Instant.now(), 2.45, "SIMULATED");
        mockMvc.perform(post("/api/consumption/records")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.consumptionKWh").value(2.45));

        mockMvc.perform(get("/api/consumption/records")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void createBatchConsumptionRecords() throws Exception {
        ConsumptionBatchRequest req = new ConsumptionBatchRequest(List.of(
                new ConsumptionRecordRequest(Instant.now().minusSeconds(3600), 1.2, "BATCH"),
                new ConsumptionRecordRequest(Instant.now(), 3.5, "BATCH")
        ));

        mockMvc.perform(post("/api/consumption/batch")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void uploadCsvFile() throws Exception {
        String csvContent = "timestamp,consumption_kwh\n2026-03-01T10:00:00Z,2.15\n2026-03-01T11:00:00Z,4.80\n";
        MockMultipartFile file = new MockMultipartFile("file", "readings.csv", "text/csv", csvContent.getBytes());

        mockMvc.perform(multipart("/api/consumption/upload-csv")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getSummaryAndAggregates() throws Exception {
        mockMvc.perform(get("/api/consumption/summary")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalKWh").isNumber());

        mockMvc.perform(get("/api/consumption/aggregates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
