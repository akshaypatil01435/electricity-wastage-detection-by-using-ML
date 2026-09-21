# WattVision AI — REST API Reference Guide

All backend REST API endpoints are prefixed with `/api`. Interactive documentation is available at `http://localhost:8080/swagger-ui.html` and OpenAPI JSON at `http://localhost:8080/api-docs`.

---

## 1. Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account (defaults to `ROLE_USER`). |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive stateless JWT token. |
| `GET` | `/api/auth/me` | Authenticated | Retrieve profile details of currently authenticated user. |

---

## 2. Digital Electricity Consumption (`/api/consumption`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/consumption/records` | Authenticated | Retrieve paginated digital consumption history for the user. |
| `POST` | `/api/consumption/records` | Authenticated | Ingest a single consumption record and automatically score via ML. |
| `POST` | `/api/consumption/batch` | Authenticated | Ingest a batch of consumption readings (used by simulator streams). |
| `POST` | `/api/consumption/upload-csv` | Authenticated | Multipart CSV upload with auto-parsing and ML anomaly evaluation. |
| `GET` | `/api/consumption/summary` | Authenticated | Get high-level KPI metrics (total kWh, cost, wasted kWh, efficiency). |
| `GET` | `/api/consumption/aggregates` | Authenticated | Get time-series aggregates (`interval=hourly\|daily\|monthly`). |

---

## 3. Wastage Events & Anomalies (`/api/wastage-events`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wastage-events` | Authenticated | List flagged anomalies with optional `status` or `severity` filter. |
| `GET` | `/api/wastage-events/{id}` | Authenticated | Get diagnostic details for a specific wastage event. |
| `PATCH` | `/api/wastage-events/{id}` | Authenticated | Update resolution status and add resolution notes. |
| `POST` | `/api/wastage-events/{id}/resolve` | Authenticated | Quick-action endpoint to mark an event as resolved. |
| `GET` | `/api/wastage-events/summary` | Authenticated | Get aggregate wastage metrics and financial loss estimates. |

---

## 4. Appliance Profiles (`/api/appliances`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appliances` | Authenticated | List all configured appliance profiles for the user. |
| `POST` | `/api/appliances` | Authenticated | Create a new appliance load profile. |
| `PUT` | `/api/appliances/{id}` | Authenticated | Update existing appliance profile. |
| `DELETE` | `/api/appliances/{id}` | Authenticated | Delete an appliance profile. |
| `GET` | `/api/appliances/breakdown` | Authenticated | Disaggregated appliance load percentages and estimated monthly cost. |

---

## 5. Alerts & Notifications (`/api/alerts`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/alerts` | Authenticated | Get paginated alert notifications. |
| `GET` | `/api/alerts/unread-count` | Authenticated | Get count of unread notifications. |
| `PATCH` | `/api/alerts/{id}/read` | Authenticated | Mark a single alert notification as read. |
| `POST` | `/api/alerts/mark-all-read` | Authenticated | Mark all alert notifications as read. |

---

## 6. Energy Audit Reports (`/api/reports`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | Authenticated | Get list of historical generated reports. |
| `POST` | `/api/reports/generate` | Authenticated | Generate a new on-demand energy audit report. |
| `GET` | `/api/reports/{id}/export-csv` | Authenticated | Download report in CSV format. |

---

## 7. Administrative Console (`/api/admin`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin Only | List all registered system users with activity statistics. |
| `PATCH` | `/api/admin/users/{id}` | Admin Only | Modify user status (Active/Suspended), role, or energy target. |
| `GET` | `/api/admin/analytics` | Admin Only | System-wide fleet consumption, wastage loss, and health metrics. |
| `GET` | `/api/admin/audit-logs` | Admin Only | Security, operational, and model modification audit logs. |
| `GET` | `/api/admin/ml-model` | Admin Only | Get active Isolation Forest model status, version, and metrics. |
| `POST` | `/api/admin/ml-model/retrain` | Admin Only | Trigger model retraining on synthetic or stored datasets. |

---

## 8. Python ML Microservice Endpoints (Port `8000`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | Liveness probe verifying server and loaded model status. |
| `GET` | `/ready` | Public | Readiness probe for container orchestration. |
| `GET` | `/metrics` | Public | Prometheus formatted metrics (prediction count, latency, anomalies). |
| `GET` | `/model/info` | API Key / Open | Model hyperparameters, training sample count, and performance metrics. |
| `POST` | `/predict` | API Key / Open | Predict anomaly flags, anomaly scores (0.0-1.0), severities, and XAI reasons. |
| `POST` | `/train` | API Key / Open | Retrain Isolation Forest model on historical/synthetic digital readings. |
