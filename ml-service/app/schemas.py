from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from .config import MAX_READINGS_PER_REQUEST


class Reading(BaseModel):
    timestamp: datetime
    consumption_kwh: float = Field(..., ge=0, le=1000, description="Energy used in the interval (kWh)")


class PredictRequest(BaseModel):
    """Time-ordered readings for ONE household/user (hourly recommended)."""
    readings: List[Reading] = Field(..., min_length=1)

    @field_validator("readings")
    @classmethod
    def limit_size(cls, v):
        if len(v) > MAX_READINGS_PER_REQUEST:
            raise ValueError(f"At most {MAX_READINGS_PER_REQUEST} readings per request")
        return v


class Prediction(BaseModel):
    timestamp: datetime
    consumption_kwh: float
    anomaly_score: float
    is_anomaly: bool
    severity: str  # NONE | MEDIUM | HIGH | CRITICAL
    reason: str


class PredictResponse(BaseModel):
    model_version: str
    threshold: float
    total: int
    anomalies: int
    predictions: List[Prediction]


class TrainRequest(BaseModel):
    """Retrain the model. Omit `readings` to train on synthetic households."""
    n_households: int = Field(40, ge=5, le=500)
    days: int = Field(45, ge=14, le=365)
    contamination: float = Field(0.03, gt=0.0, le=0.2)
    n_estimators: int = Field(200, ge=50, le=1000)
    seed: int = 42
    readings: Optional[List[Reading]] = Field(
        None, description="Optional real history for one series; skips synthetic data and metrics"
    )


class TrainResponse(BaseModel):
    model_version: str
    trained_rows: int
    threshold: float
    metrics: Optional[dict]
    message: str
