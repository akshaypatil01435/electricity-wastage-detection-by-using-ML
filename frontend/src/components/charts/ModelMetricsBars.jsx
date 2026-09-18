import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

const ModelMetricsBars = ({
  metrics = {
    precision: 94.2,
    recall: 91.8,
    f1Score: 93.0,
    detectionRate: 96.4
  },
  modelInfo = {
    algorithm: "Isolation Forest",
    version: "v1.0",
    inputFeatures: "Hour, Day, Consumption, History",
    anomalyScoreRange: "0.0 – 1.0 (higher = anomaly)",
    threshold: "0.60 (configurable)",
    modelStatus: "Active"
  },
  showInfoCard = true
}) => {
  const metricItems = [
    { label: "Precision", value: metrics.precision || 94.2 },
    { label: "Recall", value: metrics.recall || 91.8 },
    { label: "F1 Score", value: metrics.f1Score || 93.0 },
    { label: "Detection Rate", value: metrics.detectionRate || 96.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Bars matching screenshot */}
      <div className="space-y-4">
        {metricItems.map((item, idx) => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="w-28 text-slate-600 dark:text-slate-300 shrink-0">{item.label}</span>
            <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                className="h-full bg-forest-800 dark:bg-emerald-600 rounded-full"
              />
            </div>
            <span className="w-12 text-right font-bold text-slate-900 dark:text-white shrink-0">
              {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Model Info Card matching screenshot media_1787464793034.jpg */}
      {showInfoCard && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-center">
            {/* Pill chip matching screenshot */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-forest-800 text-white shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>{modelInfo.algorithm} · {modelInfo.version}</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-400">Algorithm</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{modelInfo.algorithm}</span>
            </div>
            <div className="flex items-start justify-between py-2.5 gap-4">
              <span className="text-slate-400 shrink-0">Input Features</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{modelInfo.inputFeatures}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-400">Anomaly Score</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{modelInfo.anomalyScoreRange}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-400">Threshold</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{modelInfo.threshold}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-slate-400">Model Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {modelInfo.modelStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelMetricsBars;
