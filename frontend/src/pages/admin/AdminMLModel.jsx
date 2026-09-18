import React, { useState, useEffect } from 'react';
import {
  Cpu,
  BrainCircuit,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Database,
  BarChart3
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ModelMetricsBars from '../../components/charts/ModelMetricsBars';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

const AdminMLModel = () => {
  const [modelData, setModelData] = useState(null);
  const [threshold, setThreshold] = useState(0.60);
  const [retraining, setRetraining] = useState(false);
  const [loading, setLoading] = useState(true);

  const { toastSuccess } = useToast();

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const data = await adminService.getMLModelMetrics();
        setModelData(data);
        setThreshold(data.threshold || 0.60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleUpdateThreshold = async (val) => {
    setThreshold(val);
    await adminService.updateModelThreshold(val);
    toastSuccess(`Detection sensitivity threshold calibrated to ${val}.`);
  };

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await adminService.retrainModel();
      toastSuccess('Isolation Forest model retrained with updated telemetry batches.');
    } catch (err) {
      console.error(err);
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      <PageHeader
        category="MACHINE LEARNING ENGINE"
        title="ML Model Monitoring & Calibration"
        subtitle="Evaluate unsupervised Isolation Forest decision paths, confusion matrix parameters, and calibrate sensitivity thresholds."
        actions={
          <Button
            size="sm"
            variant="primary"
            icon={BrainCircuit}
            loading={retraining}
            onClick={handleRetrain}
          >
            Retrain Model Weights
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Model Specs & Progress Bars matching screenshot */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Active Model Metrics</h3>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          <ModelMetricsBars
            metrics={modelData?.metrics}
            modelInfo={{
              algorithm: modelData?.algorithm || "Isolation Forest",
              version: modelData?.version || "v1.0",
              inputFeatures: modelData?.inputFeatures || "Hour, Day, Consumption, History",
              anomalyScoreRange: modelData?.anomalyScoreRange || "0.0 – 1.0 (higher = anomaly)",
              threshold: `${threshold.toFixed(2)} (configurable)`,
              modelStatus: modelData?.modelStatus || "Active"
            }}
          />
        </div>

        {/* Right: Confusion Matrix & Sensitivity Slider */}
        <div className="lg:col-span-6 space-y-6">
          {/* Threshold Calibration Slider */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Sensitivity Threshold Tuning</h3>
              </div>
              <span className="font-mono font-black text-emerald-400 text-lg">{threshold.toFixed(2)}</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Lower thresholds increase detection sensitivity (flags more subtle deviations). Higher thresholds prioritize critical anomalies and minimize false positive notifications.
            </p>

            <input
              type="range"
              min="0.30"
              max="0.90"
              step="0.05"
              value={threshold}
              onChange={(e) => handleUpdateThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>0.30 (Hyper-sensitive)</span>
              <span>0.60 (Recommended)</span>
              <span>0.90 (Conservative)</span>
            </div>
          </div>

          {/* 2x2 Confusion Matrix */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Confusion Matrix Evaluation
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-forest-950/80 border border-emerald-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300">True Positives (TP)</span>
                <p className="text-2xl font-black text-white">{modelData?.confusionMatrix?.truePositive.toLocaleString() || '3,290'}</p>
                <p className="text-[11px] text-emerald-400 font-medium">Accurately detected wastage</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">False Positives (FP)</span>
                <p className="text-2xl font-black text-white">{modelData?.confusionMatrix?.falsePositive.toLocaleString() || '202'}</p>
                <p className="text-[11px] text-slate-400">False alarm rate: 1.4%</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">False Negatives (FN)</span>
                <p className="text-2xl font-black text-white">{modelData?.confusionMatrix?.falseNegative.toLocaleString() || '3,208'}</p>
                <p className="text-[11px] text-slate-400">Missed anomalies</p>
              </div>

              <div className="p-4 rounded-2xl bg-forest-950/80 border border-emerald-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300">True Negatives (TN)</span>
                <p className="text-2xl font-black text-white">{modelData?.confusionMatrix?.trueNegative.toLocaleString() || '135,800'}</p>
                <p className="text-[11px] text-emerald-400 font-medium">Standard baseline instances</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMLModel;
