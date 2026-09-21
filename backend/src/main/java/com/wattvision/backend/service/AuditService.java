package com.wattvision.backend.service;

import com.wattvision.backend.entity.AuditLog;
import com.wattvision.backend.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void record(String actorEmail, String actorRole, String action, String resource, String details, String ipAddress) {
        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setActorEmail(actorEmail != null ? actorEmail : "system");
            auditLog.setActorRole(actorRole != null ? actorRole : "SYSTEM");
            auditLog.setAction(action);
            auditLog.setResource(resource);
            auditLog.setDetails(details);
            auditLog.setIpAddress(ipAddress);
            auditLogRepository.save(auditLog);
        } catch (Exception ex) {
            log.error("Failed to record audit log for action: {}", action, ex);
        }
    }
}
