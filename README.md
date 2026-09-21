# ⚡ WattVision AI — Electricity Wastage Detection Using Machine Learning

> **A 100% software-only energy analytics and machine learning anomaly detection platform.**
> Built as a final-year major engineering project by **Akshay Patil**.

[![CI Build Status](https://img.shields.io/badge/CI-Passing-brightgreen?style=flat-square&logo=githubactions)](https://github.com/akshaypatil01435/electricity-wastage-detection-by-using-ML/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 1. Project Overview

**WattVision AI** addresses the challenge of invisible household and commercial power wastage without relying on intrusive or expensive physical IoT hardware. By accepting digital electricity consumption data streams (via real-time simulated telemetry, CSV file uploads, or batch API feeds), WattVision AI employs an **unsupervised Isolation Forest model** alongside **Explainable AI (XAI)** rule heuristics to detect anomalies, quantify excess energy loss in kilowatt-hours (kWh) and Indian Rupees (₹), and deliver actionable conservation recommendations.

---

## 🏛️ 2. System Architecture

```mermaid
flowchart TB
    subgraph Client["Frontend Client (React 19 + Vite)"]
        UI[User & Admin Portals]
        Sim[Live Digital Telemetry Simulator]
        Charts[Recharts Time-Series & Heatmaps]
    end

    subgraph Proxy["Reverse Proxy"]
        Nginx[Nginx Gateway :3000]
    end

    subgraph CoreBackend["Core Backend (Spring Boot 3.3 :8080)"]
        Security[Spring Security + JWT Auth]
        Controllers[REST Controllers]
        Services[Domain Services]
        Flyway[Flyway Database Migrations]
        MLBridge[Resilient ML Inference Client]
        RetryTask[@Scheduled Reprocessing Task]
    end

    subgraph MLService["ML Microservice (FastAPI + Python 3.12 :8000)"]
        IForest[Isolation Forest Model]
        FeatEng[9-Feature Extraction Pipeline]
        XAI[Explainable AI Rules Engine]
        Prometheus[Prometheus /metrics Exporter]
    end

    subgraph Persistence["Storage Layer"]
        MySQL[(MySQL 8.4 :3306)]
    end

    Client --> Nginx
    Nginx -- "/api/*" --> CoreBackend
    Nginx -- "/*" --> Client
    CoreBackend --> MySQL
    CoreBackend -- "HTTP X-API-Key" --> MLService
```

---

## ✨ 3. Key Capabilities

1. **Digital Consumption Analytics**: Interactive visualization of hourly, daily, weekly, and monthly electricity consumption profiles with heatmap anomaly density.
2. **Unsupervised ML Anomaly Detection**: Isolation Forest model evaluating 9 statistical, temporal, and load features with dynamic quantile thresholding.
3. **Explainable AI (XAI) Diagnostics**: Automatically generates transparent root causes (e.g. night-time compressor spikes, geyser overruns, standby vampire draw) with immediate actionable solutions.
4. **Interactive Telemetry Simulator**: In-browser simulator enabling instant injection of realistic anomaly scenarios (`night_ac_spike`, `geyser_overrun`, `idle_leak`).
5. **Appliance Load Disaggregation**: Profiling tool allowing users to estimate device-specific consumption footprints and financial costs.
6. **Enterprise Administration**: Role-based access control (`ROLE_ADMIN`), user account management, audit logs, and on-demand model retraining.
7. **Production-Ready DevOps**: Full Docker Compose multi-container stack, Flyway schema migrations, and automated GitHub Actions CI pipeline.

---

## 🚀 4. Quick Start (Docker Compose)

The easiest way to run the entire WattVision AI ecosystem:

```bash
# 1. Clone the repository
git clone https://github.com/akshaypatil01435/electricity-wastage-detection-by-using-ML.git
cd electricity-wastage-detection-by-using-ML

# 2. Configure environment variables
cp .env.example .env
# Open .env and set your DB_PASSWORD, MYSQL_ROOT_PASSWORD, and JWT_SECRET

# 3. Launch the full microservice stack
docker compose up --build
```

### Access Points:
- **Frontend Application**: `http://localhost:3000`
- **Backend Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **ML Service Interactive Docs**: `http://localhost:8000/docs`
- **ML Prometheus Metrics**: `http://localhost:8000/metrics`

---

## 💻 5. Local Development Setup

### 5.1 Backend (Spring Boot 3.3)
```bash
cd backend
# Run test suite (using in-memory H2 database)
mvn test

# Run application
mvn spring-boot:run
```

### 5.2 ML Service (FastAPI + scikit-learn)
```bash
cd ml-service
python -m venv .venv
# Activate virtual environment
# Windows: .venv\Scripts\activate | Linux/macOS: source .venv/bin/activate
pip install -r requirements-dev.txt

# Run pytest suite (12 tests)
pytest -v

# Start FastAPI server
uvicorn app.main:app --port 8000 --reload
```

### 5.3 Frontend (React 19 + Vite)
```bash
cd frontend
npm install

# Run Vitest test suite (24 tests)
npm test

# Run linter
npm run lint

# Start Vite dev server (http://localhost:5173)
npm run dev
```

---

## 🧪 6. Test Suite & Verification Results

All three layers of WattVision AI have dedicated, automated test suites:

| Layer | Framework | Test Count | Status |
| :--- | :--- | :---: | :---: |
| **Backend** | JUnit 5 + Spring Boot Test + MockMvc | **20 Tests** | **100% Passed** |
| **ML Microservice** | Pytest + FastAPI TestClient | **12 Tests** | **100% Passed** |
| **Frontend** | Vitest + React Testing Library | **24 Tests** | **100% Passed** |
| **Total** | | **56 Tests** | **All Green** |

---

## 🔒 7. Presentation & Demo Mode (Viva Guide)

WattVision AI includes a seamless **Dual-Mode System**:
- **Live Mode (`VITE_DEMO_MODE=false`)**: Full production mode communicating with the real Spring Boot REST API and MySQL database.
- **Demo Mode (`VITE_DEMO_MODE=true`)**: Frictionless offline presentation mode allowing instant viva evaluation without local database requirements. Pre-populated credentials:
  - **User**: `user@wattvision.ai` / `user123`
  - **Admin**: `admin@wattvision.ai` / `admin123`

---

## 👤 Author & Acknowledgments

- **Lead Developer**: **Akshay Patil**
- **Project**: Final-Year Major Engineering Project
- **Domain**: Machine Learning, Full-Stack Software Engineering, Cloud DevOps
- **License**: [MIT License](LICENSE)
