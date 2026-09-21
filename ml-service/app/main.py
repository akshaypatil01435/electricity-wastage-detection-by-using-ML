import logging
import secrets
import time
from contextlib import asynccontextmanager

import pandas as pd
from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

from . import config
from .model_store import store
from .schemas import PredictRequest, PredictResponse, TrainRequest, TrainResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
log = logging.getLogger("wattvision.ml")

# Prometheus Metrics
PREDICTION_REQUESTS = Counter(
    "wattvision_ml_prediction_requests_total",
    "Total prediction requests received"
)
ANOMALIES_DETECTED = Counter(
    "wattvision_ml_anomalies_detected_total",
    "Total anomalies identified across all prediction requests",
    ["severity"]
)
INFERENCE_DURATION = Histogram(
    "wattvision_ml_inference_duration_seconds",
    "Time taken to execute Isolation Forest feature engineering and inference"
)
TRAINING_REQUESTS = Counter(
    "wattvision_ml_training_requests_total",
    "Total model training jobs triggered"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if store.load():
        log.info("Loaded pre-existing model version %s from persistent volume", store.meta.get("model_version"))
    else:
        log.info("No saved model found on disk - initializing and training default Isolation Forest on synthetic baseline")
        store.train()
    yield


app = FastAPI(
    title="WattVision ML Microservice",
    description="Isolation Forest anomaly detection engine for software-based digital electricity telemetry",
    version="1.0.0",
    lifespan=lifespan
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start_time
    if request.url.path not in ("/health", "/metrics", "/ready"):
        log.info("Handled %s %s with status %d in %.4fs", request.method, request.url.path, response.status_code, duration)
    return response


def require_api_key(x_api_key: str = Header(default="")) -> None:
    if config.API_KEY and not secrets.compare_digest(x_api_key, config.API_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def _to_df(readings) -> pd.DataFrame:
    ts = pd.to_datetime([r.timestamp for r in readings])
    if ts.tz is not None:
        ts = ts.tz_convert("UTC").tz_localize(None)
    return pd.DataFrame({"timestamp": ts, "consumption_kwh": [r.consumption_kwh for r in readings]})


@app.get("/health", tags=["Monitoring"])
def health():
    return {
        "status": "UP" if store.ready else "DEGRADED",
        "model_loaded": store.ready,
        "model_version": store.meta.get("model_version") if store.ready else None,
    }


@app.get("/ready", tags=["Monitoring"])
def readiness():
    if not store.ready:
        raise HTTPException(status_code=503, detail="Model is still initializing or unavailable")
    return {"status": "READY", "model_version": store.meta.get("model_version")}


@app.get("/metrics", tags=["Monitoring"])
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.get("/model/info", tags=["Model Operations"], dependencies=[Depends(require_api_key)])
def model_info():
    if not store.ready:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return store.meta


@app.post("/predict", response_model=PredictResponse, tags=["Inference"], dependencies=[Depends(require_api_key)])
def predict(req: PredictRequest):
    if not store.ready:
        raise HTTPException(status_code=503, detail="Model not loaded")

    PREDICTION_REQUESTS.inc()
    with INFERENCE_DURATION.time():
        preds = store.predict(_to_df(req.readings))

    anomalies_count = 0
    for p in preds:
        if p["is_anomaly"]:
            anomalies_count += 1
            ANOMALIES_DETECTED.labels(severity=p["severity"]).inc()

    return PredictResponse(
        model_version=store.meta["model_version"],
        threshold=store.meta["thresholds"]["anomaly"],
        total=len(preds),
        anomalies=anomalies_count,
        predictions=preds,
    )


@app.post("/train", response_model=TrainResponse, tags=["Model Operations"], dependencies=[Depends(require_api_key)])
def train(req: TrainRequest):
    TRAINING_REQUESTS.inc()
    readings_df = None
    if req.readings is not None:
        if len(req.readings) < config.MIN_READINGS_FOR_TRAINING:
            raise HTTPException(
                status_code=422,
                detail=f"At least {config.MIN_READINGS_FOR_TRAINING} readings are required to train on real data",
            )
        readings_df = _to_df(req.readings)

    meta = store.train(
        n_households=req.n_households,
        days=req.days,
        contamination=req.contamination,
        n_estimators=req.n_estimators,
        seed=req.seed,
        readings=readings_df,
    )
    return TrainResponse(
        model_version=meta["model_version"],
        trained_rows=meta["trained_rows"],
        threshold=meta["thresholds"]["anomaly"],
        metrics=meta["metrics"],
        message="Isolation Forest model successfully trained and persisted",
    )
