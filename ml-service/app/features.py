"""Feature engineering shared by training and prediction (kept in one place so they never drift)."""
from typing import List

import numpy as np
import pandas as pd

FEATURE_NAMES: List[str] = [
    "hour_sin",
    "hour_cos",
    "is_weekend",
    "is_night",
    "consumption_kwh",
    "rolling_mean_3h",
    "rolling_std_24h",
    "delta_prev",
    "ratio_to_24h_mean",
]


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    df columns: timestamp (datetime), consumption_kwh (float) for ONE series.
    Returns a frame indexed like the time-sorted input with FEATURE_NAMES columns.
    """
    d = df.sort_values("timestamp").reset_index(drop=True).copy()
    ts = pd.to_datetime(d["timestamp"])
    hour = ts.dt.hour.to_numpy()
    c = d["consumption_kwh"].astype(float)

    out = pd.DataFrame(index=d.index)
    out["hour_sin"] = np.sin(2 * np.pi * hour / 24)
    out["hour_cos"] = np.cos(2 * np.pi * hour / 24)
    out["is_weekend"] = (ts.dt.dayofweek >= 5).astype(int).to_numpy()
    out["is_night"] = ((hour >= 23) | (hour <= 5)).astype(int)
    out["consumption_kwh"] = c
    out["rolling_mean_3h"] = c.rolling(3, min_periods=1).mean()
    out["rolling_std_24h"] = c.rolling(24, min_periods=2).std().fillna(0.0)
    out["delta_prev"] = c.diff().fillna(0.0)
    mean24 = c.rolling(24, min_periods=1).mean()
    out["ratio_to_24h_mean"] = c / mean24.clip(lower=0.05)
    return out[FEATURE_NAMES]
