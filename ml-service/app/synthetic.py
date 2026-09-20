"""
Software-generated household consumption data (no hardware involved).
Normal behaviour plus injected wastage events with ground-truth labels, so the
model can be evaluated honestly.
"""
from typing import Tuple

import numpy as np
import pandas as pd

WASTAGE_TYPES = ("night_ac", "standby_surge", "all_day_high")


def _household_series(rng: np.random.Generator, days: int, start: str, anomaly_day_prob: float) -> pd.DataFrame:
    idx = pd.date_range(start=start, periods=days * 24, freq="h")
    hours = idx.hour.to_numpy()
    weekend = np.asarray(idx.dayofweek >= 5)

    base = rng.uniform(0.15, 0.45)
    scale = rng.uniform(0.7, 1.5)

    profile = np.full(len(idx), base)
    profile += np.where((hours >= 6) & (hours <= 9), 0.35 * scale, 0.0)   # morning routine
    profile += np.where((hours >= 12) & (hours <= 14), 0.2 * scale, 0.0)  # midday
    profile += np.where((hours >= 18) & (hours <= 22), 0.8 * scale, 0.0)  # evening peak
    profile *= np.where(weekend, 1.15, 1.0)
    noise = rng.lognormal(mean=0.0, sigma=0.12, size=len(idx))
    values = profile * noise

    labels = np.zeros(len(idx), dtype=int)
    for day in range(days):
        if rng.random() >= anomaly_day_prob:
            continue
        kind = rng.choice(WASTAGE_TYPES)
        d0 = day * 24
        if kind == "night_ac":
            start_h = int(rng.integers(0, 3))
            length = int(rng.integers(3, 6))
            sl = slice(d0 + start_h, d0 + start_h + length)
            values[sl] += rng.uniform(1.3, 2.4)
            labels[sl] = 1
        elif kind == "standby_surge":
            h = int(rng.integers(0, 24))
            length = int(rng.integers(1, 3))
            sl = slice(d0 + h, min(d0 + h + length, len(idx)))
            values[sl] += rng.uniform(1.8, 3.2)
            labels[sl] = 1
        else:  # all_day_high
            h = int(rng.integers(8, 14))
            length = int(rng.integers(6, 10))
            sl = slice(d0 + h, min(d0 + h + length, len(idx)))
            values[sl] *= rng.uniform(2.2, 3.2)
            labels[sl] = 1

    return pd.DataFrame({"timestamp": idx, "consumption_kwh": np.round(values, 4), "label": labels})


def generate_dataset(n_households: int, days: int, seed: int, anomaly_day_prob: float = 0.12) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    frames = []
    for h in range(n_households):
        f = _household_series(rng, days, "2026-01-01", anomaly_day_prob)
        f["household"] = h
        frames.append(f)
    return pd.concat(frames, ignore_index=True)


def split_features_labels(df: pd.DataFrame) -> Tuple[pd.DataFrame, np.ndarray]:
    from .features import build_features

    feats, labels = [], []
    for _, g in df.groupby("household"):
        g = g.sort_values("timestamp")
        feats.append(build_features(g[["timestamp", "consumption_kwh"]]))
        labels.append(g["label"].to_numpy())
    return pd.concat(feats, ignore_index=True), np.concatenate(labels)
