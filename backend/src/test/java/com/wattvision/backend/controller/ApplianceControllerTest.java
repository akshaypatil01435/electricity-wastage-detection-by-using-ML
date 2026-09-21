package com.wattvision.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wattvision.backend.dto.ApplianceRequest;
import com.wattvision.backend.dto.LoginRequest;
import com.wattvision.backend.dto.RegisterRequest;
import com.wattvision.backend.entity.ApplianceCategory;
import com.wattvision.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplianceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    private String token;

    @BeforeEach
    void setUp() {
        String email = "appliance-" + UUID.randomUUID() + "@example.com";
        authService.register(new RegisterRequest("Appliance User", email, "password123"));
        token = authService.login(new LoginRequest(email, "password123")).token();
    }

    @Test
    void createApplianceAndGetBreakdown() throws Exception {
        ApplianceRequest req = new ApplianceRequest("Inverter AC", ApplianceCategory.COOLING, 1500.0, 6.0, 10.0, "Master Bedroom");

        mockMvc.perform(post("/api/appliances")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Inverter AC"));

        mockMvc.perform(get("/api/appliances")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(get("/api/appliances/breakdown")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
