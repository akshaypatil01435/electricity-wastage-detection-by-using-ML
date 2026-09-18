import React from 'react';
import { HelpCircle, BrainCircuit, Sparkles, TrendingUp, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatKWh } from '../../utils/formatters';

const ExplainableCard = ({
  anomaly = {
    id: "ANOM-CURRENT",
    time: "22:00",
    consumption: 2.8,
    expected: 1.1,
    differencePercent: "+155%",
    anomalyScore: 0.94,
    severity: "CRITICAL",
    appliance: "Air Conditioner",
    reason: "Usage occurred during historically low-consumption hours with extreme deviation from expected baseline."
  }
}) => {
  const isCritical = anomaly.severity === 'CRITICAL' || anomaly.severity === 'HIGH';

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-xs shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Explainable AI (XAI) Diagnosis
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-900 text-emerald-300">
                Isolation Forest
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plain-language reasoning generated for anomalous interval at <strong>{anomaly.time || "22:00"}</strong>
            </p>
          </div>
        </div>

        <StatusBadge status={anomaly.severity || 'HIGH'} size="lg" />
      </div>

      {/* Primary Reason Callout */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-forest-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-emerald-300">
              Why was this anomaly flagged?
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mt-1 leading-relaxed">
              "{anomaly.reason || "Current digital consumption exceeds historical baseline during deep low-draw window."}"
            </p>
          </div>
        </div>
      </div>

      {/* 4 Feature Comparison Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
          <span className="text-[10px] font-bold uppercase text-slate-400">Expected Baseline</span>
          <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
            {formatKWh(anomaly.expected || 1.1)}
          </p>
          <span className="text-[10px] text-slate-500">Historical Avg</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
          <span className="text-[10px] font-bold uppercase text-slate-400">Actual Digital Usage</span>
          <p className="text-base font-bold text-forest-800 dark:text-emerald-400 mt-1">
            {formatKWh(anomaly.consumption || 2.8)}
          </p>
          <span className="text-[10px] text-slate-500">Peak draw</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
          <span className="text-[10px] font-bold uppercase text-slate-400">Deviation</span>
          <p className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
            {anomaly.differencePercent || "+155%"}
          </p>
          <span className="text-[10px] text-slate-500">Above baseline</span>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/80">
          <span className="text-[10px] font-bold uppercase text-slate-400">Anomaly Score</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {anomaly.anomalyScore !== undefined ? anomaly.anomalyScore.toFixed(2) : "0.94"}
          </p>
          <span className="text-[10px] text-slate-500">Threshold: 0.60</span>
        </div>
      </div>

      {/* Detailed contextual analysis bullet points */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Diagnostic Evidence Summary
        </span>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Temporal Pattern:</strong> Consumption spike occurred at {anomaly.time || "22:00"}, where historical median consumption is strictly under 1.2 kWh.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Load Characterization:</strong> Continuous sustained draw aligns with compressor/cooling cycling from {anomaly.appliance || "Air Conditioner"}.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Model Decision:</strong> Isolation Forest path length in Decision Space was exceptionally short (Anomaly Score: {anomaly.anomalyScore || 0.94}), confirming statistical outlier.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExplainableCard;
