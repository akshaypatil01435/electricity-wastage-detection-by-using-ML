from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import pytest
from fastapi.testclient import TestClient

from app import config
from app.features import FEATURE_NAMES, build_features
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:  # runs lifespan -> trains default model
        yield c


def normal_series(hours=72, seed=1):
    rng = np.random.default_rng(seed)
    start = datetime(2026, 3, 2, 0, 0)  # a Monday
    rows = []
    for i in range(hours):
        ts = start + timedelta(hours=i)
        h = ts.hour
        base = 0.3 + (0.35 if 6 <= h <= 9 else 0) + (0.8 if 18 <= h <= 22 else 0)
        rows.append({"timestamp": ts.isoformat(), "consumption_kwh": round(base * rng.lognormal(0, 0.1), 4)})
    return rows


def test_feature_builder_columns_and_no_nans():
    df = pd.DataFrame(
        {
            "timestamp": pd.date_range("2026-01-01", periods=48, freq="h"),
            "consumption_kwh": np.linspace(0.2, 1.0, 48),
        }
    )
    feats = build_features(df)
    assert list(feats.columns) == FEATURE_NAMES
    assert len(feats) == 48
    assert not feats.isna().any().any()


def test_health_reports_model_loaded(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["model_loaded"] is True


def test_readiness_endpoint(client):
    r = client.get("/ready")
    assert r.status_code == 200
    assert r.json()["status"] == "READY"


def test_prometheus_metrics_endpoint(client):
    r = client.get("/metrics")
    assert r.status_code == 200
    assert "wattvision_ml_prediction_requests_total" in r.text


def test_model_info_has_real_metrics(client):
    info = client.get("/model/info").json()
    assert info["algorithm"] == "IsolationForest"
    m = info["metrics"]
    assert m["roc_auc"] > 0.8, m
    assert m["recall"] > 0.4, m
    assert 0 <= m["precision"] <= 1


def test_normal_usage_mostly_not_flagged(client):
    r = client.post("/predict", json={"readings": normal_series()})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 72
    assert body["anomalies"] / body["total"] < 0.15


def test_night_spike_is_flagged(client):
    series = normal_series()
    for i in range(len(series)):
        if series[i]["timestamp"].startswith("2026-03-03T03"):
            series[i]["consumption_kwh"] = 4.5
    r = client.post("/predict", json={"readings": series})
    flagged = [p for p in r.json()["predictions"] if p["timestamp"].startswith("2026-03-03T03")]
    assert flagged and flagged[0]["is_anomaly"] is True
    assert flagged[0]["severity"] in {"MEDIUM", "HIGH", "CRITICAL"}
    assert "night" in flagged[0]["reason"].lower() or "surge" in flagged[0]["reason"].lower()


def test_validation_rejects_bad_input(client):
    assert client.post("/predict", json={"readings": []}).status_code == 422
    bad = {"readings": [{"timestamp": "2026-01-01T00:00:00", "consumption_kwh": -5}]}
    assert client.post("/predict", json=bad).status_code == 422


def test_timezone_aware_timestamps_are_accepted(client):
    series = normal_series(hours=30)
    for row in series:
        row["timestamp"] = row["timestamp"] + "Z"
    assert client.post("/predict", json={"readings": series}).status_code == 200


def test_train_endpoint_small_run(client):
    r = client.post("/train", json={"n_households": 8, "days": 20, "n_estimators": 60})
    assert r.status_code == 200
    assert r.json()["metrics"] is not None


def test_train_on_real_data_requires_enough_rows(client):
    payload = {"readings": normal_series(hours=24)}
    assert client.post("/train", json=payload).status_code == 422


def test_api_key_enforced_when_configured(client, monkeypatch):
    monkeypatch.setattr(config, "API_KEY", "secret-key")
    body = {"readings": normal_series(hours=24)}
    assert client.post("/predict", json=body).status_code == 401
    assert client.post("/predict", json=body, headers={"X-API-Key": "wrong"}).status_code == 401
    assert client.post("/predict", json=body, headers={"X-API-Key": "secret-key"}).status_code == 200
