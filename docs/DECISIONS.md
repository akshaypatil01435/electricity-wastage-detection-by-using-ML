# WattVision AI — Architectural Decision Records (ADRs)

## ADR-001: Separation of Concerns & Software-Only Telemetry Architecture
* **Status**: Accepted
* **Context**: The project objective is "Electricity Wastage Detection using Machine Learning" without reliance on physical IoT or smart meter hardware.
* **Decision**: Adopt a three-tier decoupled microservices architecture:
  1. **Frontend**: React 19 Single Page Application with Recharts visualizations, dark/light theme, and live telemetry simulator.
  2. **Backend**: Spring Boot 3.3 REST API managing persistence, user sessions, role-based authorization, batch consumption ingestion, alerting, and orchestration.
  3. **ML Inference Service**: Python 3.12 FastAPI microservice hosting an scikit-learn Isolation Forest model with 9 feature pipelines, dynamic quantile thresholding, and XAI rule generation.

## ADR-002: Database Migrations via Flyway & MySQL / H2 Dual Profile
* **Status**: Accepted
* **Context**: Schema evolution must be automated, idempotent, and production-safe across both MySQL (production/compose) and H2 in-memory (fast unit/integration testing).
* **Decision**: Use Flyway for explicit SQL migrations in `src/main/resources/db/migration`. Set `spring.jpa.hibernate.ddl-auto=validate` for production and `spring.jpa.hibernate.ddl-auto=none` with Flyway.

## ADR-003: Resilient Backend-to-ML Communication
* **Status**: Accepted
* **Context**: The Spring Boot backend must ingest consumption streams (single reading, batch, CSV uploads) and score them against the ML service. If the ML service is temporarily unavailable or restarting, consumption data ingestion must never fail.
* **Decision**:
  - Implement `MlInferenceClient` using Spring 6 `RestClient` with timeout configurations (3s connect, 10s read) and Resilience4j circuit breaking / retry.
  - If ML inference fails or is degraded, persist consumption records, mark status as `UNPROCESSED`, and trigger automated asynchronous background reprocessing via `@Scheduled` tasks once the ML service recovers.

## ADR-004: Frontend Dual Mode (Live API vs. Offline Presentation)
* **Status**: Accepted
* **Context**: For viva evaluations, demonstrations, and offline presentations, the application should allow switching between live backend REST API mode and offline mock simulation.
* **Decision**: Default `VITE_DEMO_MODE=false` in production Docker/CI builds. When `VITE_DEMO_MODE=false`, all services call live Spring Boot endpoints with real JWT authentication and authorization. Demo mode remains an explicit option for local presentation flexibility.
