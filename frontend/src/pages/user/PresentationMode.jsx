import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Presentation,
  Zap,
  Activity,
  AlertTriangle,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ChevronRight,
  Tv,
  Wind,
  Flame,
  Award
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import StatusBadge from '../../components/common/StatusBadge';
import ConsumptionLineChart from '../../components/charts/ConsumptionLineChart';
import ModelMetricsBars from '../../components/charts/ModelMetricsBars';
import Button from '../../components/common/Button';
import { useSimulator } from '../../context/SimulatorContext';
import { APP_CONFIG } from '../../utils/constants';
import { formatKWh } from '../../utils/formatters';

const PresentationMode = () => {
  const {
    isRunning,
    speed,
    setSpeed,
    simulatedHour,
    currentReading,
    streamHistory,
    anomaliesCount,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    triggerAnomaly
  } = useSimulator();

  const [activeSlide, setActiveSlide] = useState('telemetry'); // telemetry, pipeline, model

  const workflowSteps = [
    { title: "Digital Data", desc: "Digital load stream feed" },
    { title: "Preprocessing", desc: "Feature normalization & rolling medians" },
    { title: "ML Classifier", desc: "Isolation Forest anomaly isolation" },
    { title: "Anomaly Flag", desc: "Severity ranking & threshold check" },
    { title: "XAI Diagnosis", desc: "Explainable rationale generation" },
    { title: "Action & Savings", desc: "Actionable recommendations" }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Viva Header */}
      <div className="p-6 rounded-3xl bg-forest-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-950 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-700/60 shrink-0">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                FINAL YEAR CAPSTONE VIVA MODE
              </span>
              <span className="text-xs text-emerald-200">·</span>
              <span className="text-xs text-emerald-200 font-semibold">{APP_CONFIG.name}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-0.5">
              Electricity Wastage Detection Using Machine Learning
            </h1>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveSlide('telemetry')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              activeSlide === 'telemetry' ? 'bg-white text-forest-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Live Telemetry
          </button>
          <button
            onClick={() => setActiveSlide('pipeline')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              activeSlide === 'pipeline' ? 'bg-white text-forest-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Pipeline Flow
          </button>
          <button
            onClick={() => setActiveSlide('model')}
            className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all ${
              activeSlide === 'model' ? 'bg-white text-forest-900 shadow-xs' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Model Architecture
          </button>
        </div>
      </div>

      {activeSlide === 'telemetry' && (
        <div className="space-y-6">
          {/* Top 4 Viva Stat Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Live Reading</span>
              <p className="text-3xl font-extrabold text-forest-800 dark:text-emerald-400">
                {currentReading.consumption} <span className="text-xs font-semibold text-slate-400">kWh</span>
              </p>
              <span className="text-[11px] text-slate-500">Baseline: {currentReading.expectedBaseline} kWh</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Anomaly Score</span>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {currentReading.anomalyScore}
              </p>
              <span className="text-[11px] text-slate-500">Threshold: 0.60</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Severity Status</span>
              <div className="pt-1">
                <StatusBadge status={currentReading.severity} size="lg" />
              </div>
              <span className="text-[11px] text-slate-500 block pt-1">Isolation Forest v1.0</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Anomalies Logged</span>
              <p className="text-3xl font-extrabold text-rose-600">
                {anomaliesCount}
              </p>
              <span className="text-[11px] text-slate-500">During Viva Session</span>
            </div>
          </div>

          {/* Large Live Chart & Live Explainable Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live Telemetry Stream
                  </h3>
                  <p className="text-xs text-slate-500">Real-time digital signal plotting and anomaly flagging</p>
                </div>
                <div className="flex items-center gap-2">
                  {isRunning ? (
                    <Button size="sm" variant="secondary" icon={Pause} onClick={pauseSimulation}>
                      Pause
                    </Button>
                  ) : (
                    <Button size="sm" variant="primary" icon={Play} onClick={startSimulation}>
                      Run
                    </Button>
                  )}
                  <Button size="sm" variant="outline" icon={RotateCcw} onClick={resetSimulation}>
                    Reset
                  </Button>
                </div>
              </div>

              <ConsumptionLineChart data={streamHistory} height={320} xKey="time" />
            </div>

            {/* Right: Live Interactive Scenarios for External Reviewers */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
                Demonstrate Scenarios
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => triggerAnomaly('night_ac_spike')}
                  className="w-full p-3 text-left rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-rose-900 text-xs">
                    <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-rose-600" /> Overrun AC Load</span>
                    <span className="text-[10px] bg-rose-200 px-1.5 py-0.2 rounded">+155%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Simulate AC running at 2 AM without sleep timer</p>
                </button>

                <button
                  onClick={() => triggerAnomaly('geyser_overrun')}
                  className="w-full p-3 text-left rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-amber-900 text-xs">
                    <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-600" /> Morning Geyser Leak</span>
                    <span className="text-[10px] bg-amber-200 px-1.5 py-0.2 rounded">+100%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Simulate water heater left on &gt;90 mins</p>
                </button>

                <button
                  onClick={() => triggerAnomaly('idle_leak')}
                  className="w-full p-3 text-left rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-blue-900 text-xs">
                    <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-blue-600" /> Idle Standby Surge</span>
                    <span className="text-[10px] bg-blue-200 px-1.5 py-0.2 rounded">+72%</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Simulate unmonitored electronics cluster</p>
                </button>
              </div>

              {/* Explainable AI callout */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                  <span>Latest Explainable Diagnosis:</span>
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                  {currentReading.isWastage
                    ? `Current draw (${currentReading.consumption} kWh) significantly surpasses baseline (${currentReading.expectedBaseline} kWh). Attributed to ${currentReading.activeProfile}.`
                    : "Consumption is nominal and matches seasonal baseline curve."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSlide === 'pipeline' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">
            Complete Six-Stage Machine Learning Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.title}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="w-10 h-10 rounded-full bg-forest-800 text-white font-bold flex items-center justify-center text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSlide === 'model' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Model Evaluation & Isolation Forest Specifications
          </h2>
          <div className="max-w-xl mx-auto">
            <ModelMetricsBars />
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationMode;
