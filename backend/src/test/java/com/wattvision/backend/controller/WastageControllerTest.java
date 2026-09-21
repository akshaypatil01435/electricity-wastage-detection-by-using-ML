package com.wattvision.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wattvision.backend.dto.LoginRequest;
import com.wattvision.backend.dto.RegisterRequest;
import com.wattvision.backend.dto.WastageEventUpdateRequest;
import com.wattvision.backend.entity.User;
import com.wattvision.backend.entity.WastageEvent;
import com.wattvision.backend.entity.WastageSeverity;
import com.wattvision.backend.entity.WastageStatus;
import com.wattvision.backend.repository.UserRepository;
import com.wattvision.backend.repository.WastageEventRepository;
import com.wattvision.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WastageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WastageEventRepository wastageRepository;

    private String token;
    private User user;
    private WastageEvent event;

    @BeforeEach
    void setUp() {
        String email = "wastage-" + UUID.randomUUID() + "@example.com";
        authService.register(new RegisterRequest("Wastage User", email, "password123"));
        token = authService.login(new LoginRequest(email, "password123")).token();
        user = userRepository.findByEmailIgnoreCase(email).orElseThrow();

        event = new WastageEvent();
        event.setUser(user);
        event.setTimestamp(Instant.now());
        event.setConsumptionKWh(4.8);
        event.setExpectedBaselineKWh(1.4);
        event.setAnomalyScore(0.85);
        event.setSeverity(WastageSeverity.CRITICAL);
        event.setReason("Sudden night-time surge");
        event.setStatus(WastageStatus.UNRESOLVED);
        event = wastageRepository.save(event);
    }

    @Test
    void getEventsListAndSummary() throws Exception {
        mockMvc.perform(get("/api/wastage-events")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].reason").value("Sudden night-time surge"));

        mockMvc.perform(get("/api/wastage-events/summary")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalEvents").isNumber());
    }

    @Test
    void resolveWastageEvent() throws Exception {
        WastageEventUpdateRequest updateReq = new WastageEventUpdateRequest(WastageStatus.RESOLVED, "Turned off AC");

        mockMvc.perform(patch("/api/wastage-events/" + event.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"))
                .andExpect(jsonPath("$.resolutionNote").value("Turned off AC"));
    }
}
