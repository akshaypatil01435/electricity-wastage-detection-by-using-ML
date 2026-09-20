# WattVision AI

**Electricity Wastage Detection using Machine Learning** — a 100% software-only platform.
It analyses digital electricity-consumption data (simulated, imported, or backend-generated)
and flags abnormal usage with an Isolation Forest model. No IoT hardware, smart meters or sensors are used.

## Architecture (target)

```
React (Vite)  ──►  Spring Boot REST API  ──►  Python FastAPI ML service
                        │                          (Isolation Forest)
                        ▼                                │
                     MySQL  ◄──────── results ───────────┘
```

| Layer | Tech | Status |
|---|---|---|
| Frontend | React 19, Vite, Tailwind, Recharts | UI complete; real login/register wired (set `VITE_DEMO_MODE=false`), other pages still on mock data |
| Backend | Spring Boot 3.3, Java 17, Spring Security + JWT, JPA | Auth foundation done |
| Database | MySQL 8 | `users` table via JPA |
| ML service | FastAPI + scikit-learn Isolation Forest | Working and tested; not yet called by Spring Boot |

## Prerequisites
Java 17+, Maven (or the included `mvnw`), Node 20+, MySQL 8.

## Run the backend
1. Create the database and a dedicated user in MySQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS wattvision_db;
   CREATE USER 'wattvision'@'localhost' IDENTIFIED BY 'choose-a-strong-password';
   GRANT ALL PRIVILEGES ON wattvision_db.* TO 'wattvision'@'localhost';
   ```
2. Set environment variables (see `.env.example`). Required: `DB_PASSWORD`, `JWT_SECRET` (32+ characters).
   Optional: `ADMIN_PASSWORD` creates the first admin (`admin@wattvision.ai`) on startup.
   In IntelliJ: Run → Edit Configurations → Environment variables.
3. Start it:
   ```bash
   cd backend
   ./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
   ```
4. Check `http://localhost:8080/api/health`.

### Backend tests
```bash
cd backend
./mvnw test
```
Tests use an in-memory H2 database (profile `test`), so MySQL is not needed.

## Run the ML service
```bash
cd ml-service
python -m venv .venv && .venv\Scripts\activate     # Windows (Linux/macOS: source .venv/bin/activate)
pip install -r requirements-dev.txt
pytest -q                                            # 10 tests
uvicorn app.main:app --port 8000
```
On first start it trains a default Isolation Forest on **software-generated** household data and saves it to `ml-service/models/`.
Interactive docs: `http://localhost:8000/docs`. Set `ML_API_KEY` to require an `X-API-Key` header.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness + model loaded? |
| GET | `/model/info` | version, thresholds, evaluation metrics |
| POST | `/predict` | score time-ordered readings, returns anomaly flag, score, severity, reason |
| POST | `/train` | retrain on synthetic data, or on supplied readings |

**Metrics honesty:** the numbers in `/model/info` come from a held-out *synthetic* labelled set. They demonstrate the pipeline,
not real-world accuracy. Report them as such in your viva.

## Run the frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```
- `VITE_DEMO_MODE=true` (default): mock data and demo login, works without the backend.
- `VITE_DEMO_MODE=false`: real login/register against Spring Boot (start the backend first). Put it in `frontend/.env.local`.

## Run everything with Docker
```bash
cp .env.example .env      # fill in DB_PASSWORD, MYSQL_ROOT_PASSWORD, JWT_SECRET (32+ chars), ADMIN_PASSWORD
docker compose up --build
```
Frontend `http://localhost:3000`, API `http://localhost:8080/api/health`, ML `http://localhost:8000/docs`.

## API (implemented)
| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | public |
| POST | `/api/auth/register` | public (always creates role USER) |
| POST | `/api/auth/login` | public |
| GET | `/api/auth/me` | authenticated |

## Roadmap
1. ✅ Phase 0 — secrets to env vars, `.gitignore`, README, consistent branding
2. ✅ Phase 1 — JWT auth, roles, CORS, JSON error handling, tests
3. Phase 2 — entities and APIs: consumption, appliances, wastage events, alerts
4. Phase 3 — data simulator and CSV import
5. ✅ Phase 4 — FastAPI Isolation Forest service
6. Phase 5 — Spring Boot ↔ ML integration
7. 🔶 Phase 6 — frontend auth wired to the real API; remaining pages still use mock data
8. 🔶 Phase 7 — Docker and CI added; more tests to come
