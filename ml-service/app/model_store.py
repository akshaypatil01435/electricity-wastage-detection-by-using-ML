"""Train / persist / load / score the Isolation Forest."""
import json
import threading
from datetime import datetime, timezone
from typing import List, Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from . import config
from .features import FEATURE_NAMES, build_features
from .synthetic import generate_dataset, split_features_labels


class ModelStore:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.pipeline: Optional[Pipeline] = None
        self.meta: dict = {}

    # ---------- persistence ----------
    def load(self) -> bool:
        if config.MODEL_PATH.exists() and config.META_PATH.exists():
            self.pipeline = joblib.load(config.MODEL_PATH)
            self.meta = json.loads(config.META_PATH.read_text())
            return True
        return False

    def _save(self) -> None:
        config.MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.pipeline, config.MODEL_PATH)
        config.META_PATH.write_text(json.dumps(self.meta, indent=2))

    @property
    def ready(self) -> bool:
        return self.pipeline is not None

    # ---------- training ----------
    def train(
        self,
        n_households: int = 40,
        days: int = 45,
        contamination: float = 0.03,
        n_estimators: int = 200,
        seed: int = 42,
        readings: Optional[pd.DataFrame] = None,
    ) -> dict:
        if readings is not None:
            X = build_features(readings)
            data_source = "provided_readings"
        else:
            df = generate_dataset(n_households, days, seed)
            X, _ = split_features_labels(df)
            data_source = "synthetic_households"

        pipeline = Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "forest",
                    IsolationForest(
                        n_estimators=n_estimators,
                        contamination=contamination,
                        random_state=seed,
                        n_jobs=-1,
                    ),
                ),
            ]
        )
        pipeline.fit(X)

        train_scores = self._anomaly_scores(pipeline, X)
        threshold = float(-pipeline.named_steps["forest"].offset_)  # anomaly_score above this => anomaly
        thresholds = {
            "anomaly": threshold,
            "high": float(np.quantile(train_scores, 0.995)),
            "critical": float(np.quantile(train_scores, 0.999)),
        }
        # keep the bands ordered even on tiny datasets
        thresholds["high"] = max(thresholds["high"], threshold)
        thresholds["critical"] = max(thresholds["critical"], thresholds["high"])

        metrics = None
        if readings is None:
            # Honest evaluation: a different random seed, with ground-truth labels
            test_df = generate_dataset(15, days, seed + 1000)
            Xt, yt = split_features_labels(test_df)
            scores = self._anomaly_scores(pipeline, Xt)
            pred = (scores > threshold).astype(int)
            p, r, f1, _ = precision_recall_fscore_support(yt, pred, average="binary", zero_division=0)
            metrics = {
                "precision": round(float(p), 4),
                "recall": round(float(r), 4),
                "f1": round(float(f1), 4),
                "roc_auc": round(float(roc_auc_score(yt, scores)), 4),
                "test_rows": int(len(yt)),
                "test_anomaly_rate": round(float(yt.mean()), 4),
                "evaluated_on": "held-out synthetic labelled data",
            }

        version = "if-" + datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        meta = {
            "model_version": version,
            "algorithm": "IsolationForest",
            "trained_at": datetime.now(timezone.utc).isoformat(),
            "data_source": data_source,
            "trained_rows": int(len(X)),
            "n_estimators": n_estimators,
            "contamination": contamination,
            "features": FEATURE_NAMES,
            "thresholds": thresholds,
            "metrics": metrics,
        }
        with self._lock:
            self.pipeline = pipeline
            self.meta = meta
            self._save()
        return meta

    # ---------- inference ----------
    @staticmethod
    def _anomaly_scores(pipeline: Pipeline, X: pd.DataFrame) -> np.ndarray:
        Xs = pipeline.named_steps["scaler"].transform(X)
        # sklearn's score_samples is the NEGATIVE of the paper's score; flip it so higher = more anomalous
        return -pipeline.named_steps["forest"].score_samples(Xs)

    def predict(self, df: pd.DataFrame) -> List[dict]:
        if not self.ready:
            raise RuntimeError("Model is not loaded")
        df = df.sort_values("timestamp").reset_index(drop=True)
        X = build_features(df)
        scores = self._anomaly_scores(self.pipeline, X)
        t = self.meta["thresholds"]
        out = []
        for i, score in enumerate(scores):
            score = float(score)
            is_anomaly = score > t["anomaly"]
            if not is_anomaly:
                severity = "NONE"
            elif score >= t["critical"]:
                severity = "CRITICAL"
            elif score >= t["high"]:
                severity = "HIGH"
            else:
                severity = "MEDIUM"
            row = X.iloc[i]
            out.append(
                {
                    "timestamp": df.loc[i, "timestamp"].to_pydatetime(),
                    "consumption_kwh": float(df.loc[i, "consumption_kwh"]),
                    "anomaly_score": round(score, 4),
                    "is_anomaly": bool(is_anomaly),
                    "severity": severity,
                    "reason": self._reason(row) if is_anomaly else "Within normal usage pattern",
                }
            )
        return out

    @staticmethod
    def _reason(row: pd.Series) -> str:
        ratio = float(row["ratio_to_24h_mean"])
        if row["is_night"] and ratio > 1.5:
            return f"Unusually high night-time usage ({ratio:.1f}x the recent 24h average)"
        if ratio > 2.0:
            return f"Sudden surge ({ratio:.1f}x the recent 24h average)"
        if float(row["delta_prev"]) > 1.0:
            return "Sharp jump compared with the previous reading"
        return "Usage pattern deviates from this household's normal behaviour"


store = ModelStore()
