package com.wattvision.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wattvision.backend.dto.AdminUserUpdateRequest;
import com.wattvision.backend.dto.LoginRequest;
import com.wattvision.backend.dto.RegisterRequest;
import com.wattvision.backend.entity.Role;
import com.wattvision.backend.entity.User;
import com.wattvision.backend.repository.UserRepository;
import com.wattvision.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String adminToken;
    private String userToken;
    private User normalUser;

    @BeforeEach
    void setUp() {
        String adminEmail = "admin-" + UUID.randomUUID() + "@example.com";
        User admin = new User();
        admin.setName("Admin Boss");
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode("admin12345"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        adminToken = authService.login(new LoginRequest(adminEmail, "admin12345")).token();

        String userEmail = "normal-" + UUID.randomUUID() + "@example.com";
        authService.register(new RegisterRequest("Normal User", userEmail, "password123"));
        userToken = authService.login(new LoginRequest(userEmail, "password123")).token();
        normalUser = userRepository.findByEmailIgnoreCase(userEmail).orElseThrow();
    }

    @Test
    void nonAdminCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanListUsersAndAnalytics() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        mockMvc.perform(get("/api/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").isNumber());

        mockMvc.perform(get("/api/admin/audit-logs")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void adminCanUpdateUserRoleAndStatus() throws Exception {
        AdminUserUpdateRequest req = new AdminUserUpdateRequest(false, Role.ADMIN, 600.0, 8.5);

        mockMvc.perform(patch("/api/admin/users/" + normalUser.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }
}
