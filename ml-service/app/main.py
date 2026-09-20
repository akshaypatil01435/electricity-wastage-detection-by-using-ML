import logging
import secrets
from contextlib import asynccontextmanager

import pandas as pd
from fastapi import Depends, FastAPI, Header, HTTPException

from . import config
from .model_store import store
from .schemas import PredictRequest, PredictResponse, TrainRequest, TrainResponse

log = logging.getLogger("wattvision.ml")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if store.load():
        log.info("Loaded model %s", store.meta.get("model_version"))
    else:
        log.info("No saved model found - training a default model on synthetic data")
        store.train()
    yield


app = FastAPI(title="WattVision ML Service", version="1.0.0", lifespan=lifespan)


def require_api_key(x_api_key: str = Header(default="")) -> None:
    if config.API_KEY and not secrets.compare_digest(x_api_key, config.API_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def _to_df(readings) -> pd.DataFrame:
    ts = pd.to_datetime([r.timestamp for r in readings])
    if ts.tz is not None:  # normalise to naive UTC so mixed inputs behave the same
        ts = ts.tz_convert("UTC").tz_localize(None)
    return pd.DataFrame({"timestamp": ts, "consumption_kwh": [r.consumption_kwh for r in readings]})


@app.get("/health")
def health():
    return {
        "status": "UP" if store.ready else "DEGRADED",
        "model_loaded": store.ready,
        "model_version": store.meta.get("model_version"),
    }


@app.get("/model/info", dependencies=[Depends(require_api_key)])
def model_info():
    if not store.ready:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return store.meta


@app.post("/predict", response_model=PredictResponse, dependencies=[Depends(require_api_key)])
def predict(req: PredictRequest):
    if not store.ready:
        raise HTTPException(status_code=503, detail="Model not loaded")
    preds = store.predict(_to_df(req.readings))
    return PredictResponse(
        model_version=store.meta["model_version"],
        threshold=store.meta["thresholds"]["anomaly"],
        total=len(preds),
        anomalies=sum(1 for p in preds if p["is_anomaly"]),
        predictions=preds,
    )


@app.post("/train", response_model=TrainResponse, dependencies=[Depends(require_api_key)])
def train(req: TrainRequest):
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
        message="Model trained and saved",
    )
