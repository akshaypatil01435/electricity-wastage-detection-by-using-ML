-- ==========================================================
-- WattVision AI Database Schema Initial Migration (V1)
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    monthly_goal_kwh DOUBLE DEFAULT 450.0,
    electricity_tariff DOUBLE DEFAULT 7.50,
    phone VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS consumption_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    consumption_kwh DOUBLE NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'SIMULATED',
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consumption_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_consumption_user_time ON consumption_records(user_id, timestamp);
CREATE INDEX idx_consumption_processed ON consumption_records(processed);

CREATE TABLE IF NOT EXISTS wastage_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    consumption_record_id BIGINT NULL,
    timestamp TIMESTAMP NOT NULL,
    consumption_kwh DOUBLE NOT NULL,
    expected_baseline_kwh DOUBLE NOT NULL DEFAULT 0.0,
    anomaly_score DOUBLE NOT NULL,
    severity VARCHAR(20) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    recommendation VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'UNRESOLVED',
    resolution_note TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wastage_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_wastage_user_time ON wastage_events(user_id, timestamp);
CREATE INDEX idx_wastage_status ON wastage_events(status);

CREATE TABLE IF NOT EXISTS appliance_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    rated_power_watts DOUBLE NOT NULL,
    daily_usage_hours DOUBLE NOT NULL,
    standby_power_watts DOUBLE NOT NULL DEFAULT 0.0,
    location VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appliance_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_appliance_user ON appliance_profiles(user_id);

CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    wastage_event_id BIGINT NULL,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'WARNING',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_alert_user_read ON alerts(user_id, is_read);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_email VARCHAR(150) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(200) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_actor ON audit_logs(actor_email);
CREATE INDEX idx_audit_time ON audit_logs(created_at);

CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_consumption_kwh DOUBLE NOT NULL DEFAULT 0.0,
    estimated_wastage_kwh DOUBLE NOT NULL DEFAULT 0.0,
    estimated_cost_inr DOUBLE NOT NULL DEFAULT 0.0,
    potential_savings_inr DOUBLE NOT NULL DEFAULT 0.0,
    anomalies_count INT NOT NULL DEFAULT 0,
    summary_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_report_user_time ON reports(user_id, created_at);
