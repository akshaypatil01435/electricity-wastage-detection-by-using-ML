import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = Path(os.getenv("MODEL_DIR", BASE_DIR / "models"))
MODEL_PATH = MODEL_DIR / "isolation_forest.joblib"
META_PATH = MODEL_DIR / "model_meta.json"

# Shared secret between Spring Boot and this service. If empty, auth is disabled (local dev only).
API_KEY = os.getenv("ML_API_KEY", "")

MAX_READINGS_PER_REQUEST = int(os.getenv("ML_MAX_READINGS", "20000"))
MIN_READINGS_FOR_TRAINING = 500
