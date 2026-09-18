import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Bell,
  Gauge,
  Sparkles,
  Flame,
  Wind,
  Layers,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ConsumptionLineChart from '../../components/charts/ConsumptionLineChart';
import { useSimulator } from '../../context/SimulatorContext';
import { formatKWh } from '../../utils/formatters';

const SimulatorPage = () => {
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

  const pipelineStages = [
    { id: 'data', label: '1. Digital Stream', icon: Zap, active: true },
    { id: 'processing', label: '2. Feature Prep', icon: Activity, active: true },
    { id: 'ml', label: '3. Isolation Forest', icon: BrainCircuit, active: true },
    { id: 'alert', label: '4. Wastage Flag', icon: AlertTriangle, active: currentReading.isWastage }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="LIVE SIMULATION SANDBOX"
        title="Digital Consumption Simulator"
        subtitle="Real-time software telemetry engine. Simulate dynamic load profiles, inject sudden wastage anomalies, and observe automated ML detection."
        actions={
          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button size="sm" variant="secondary" icon={Pause} onClick={pauseSimulation}>
                Pause Simulation
              </Button>
            ) : (
              <Button size="sm" variant="primary" icon={Play} onClick={startSimulation}>
                Start Simulation
              </Button>
            )}
            <Button size="sm" variant="outline" icon={RotateCcw} onClick={resetSimulation}>
              Reset
            </Button>
          </div>
        }
      />

      {/* Speed Controls & Top Status Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Simulation Engine Status: <span className="text-forest-800 dark:text-emerald-400">{isRunning ? 'Running' : 'Paused'}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Simulated Interval: <strong className="text-slate-700 dark:text-slate-200">{simulatedHour.toString().padStart(2, '0')}:00</strong> · Anomalies Captured: <strong className="text-rose-600">{anomaliesCount}</strong>
            </p>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Speed:</span>
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 text-xs rounded-xl font-bold transition-all ${
                speed === s
                  ? 'bg-forest-800 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 4-Step Animated Pipeline Visualizer */}
      <div className="p-6 rounded-3xl bg-forest-900 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-tight">Active Pipeline Telemetry</h3>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-950 text-emerald-300 border border-emerald-700">
            100% Software Feed
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.id}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  stg.active
                    ? 'bg-forest-800/80 border-emerald-500/80 text-white shadow-md'
                    : 'bg-forest-950/60 border-forest-800/60 text-slate-400 opacity-60'
                }`}
              >
                <div className="p-2 rounded-xl bg-forest-950 text-emerald-300 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{stg.label}</h4>
                  <p className="text-[10px] text-emerald-200 mt-0.5">
                    {stg.id === 'data' && `${currentReading.consumption} kWh`}
                    {stg.id === 'processing' && 'Normalized'}
                    {stg.id === 'ml' && `Score: ${currentReading.anomalyScore}`}
                    {stg.id === 'alert' && (currentReading.isWastage ? 'Triggered' : 'Nominal')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Stream Telemetry & Real-Time Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Chart Stream */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Simulated Data Stream
              </h3>
              <p className="text-xs text-slate-500">Live ticks generated every {Math.round(1000 / speed)}ms</p>
            </div>
            <StatusBadge status={currentReading.severity} size="md" />
          </div>

          <ConsumptionLineChart data={streamHistory} height={280} xKey="time" />
        </div>

        {/* Live Value Inspector */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Current Telemetry Readout
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60">
              <span className="text-[10px] font-bold uppercase text-slate-500">Incoming Power Draw</span>
              <p className="text-3xl font-extrabold text-forest-900 dark:text-white mt-1">
                {currentReading.consumption} <span className="text-sm font-bold text-slate-500">kWh</span>
              </p>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Baseline Target:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{currentReading.expectedBaseline} kWh</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">ML Anomaly Score:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{currentReading.anomalyScore}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-slate-500">Active Profile:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-right truncate max-w-[160px]">
                {currentReading.activeProfile}
              </span>
            </div>
          </div>

          {currentReading.isWastage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-[11px] text-rose-800 dark:text-rose-200 font-medium">
              ⚠️ Anomaly detected: Current load deviates significantly from baseline.
            </div>
          )}
        </div>
      </div>

      {/* Anomaly Injection Sandbox */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Inject Wastage Scenarios (Viva Demonstration)
          </h3>
          <p className="text-xs text-slate-500">
            Click any scenario to inject abnormal power spikes into the simulated stream and watch the ML classifier respond.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => triggerAnomaly('night_ac_spike')}
            className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-left transition-all space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-rose-800 text-xs">
              <Wind className="w-4 h-4 text-rose-600" />
              <span>Overnight AC Spike</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Simulates master bedroom AC running at full blast at 2 AM (+155% deviation).
            </p>
          </button>

          <button
            onClick={() => triggerAnomaly('geyser_overrun')}
            className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-left transition-all space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-amber-800 text-xs">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Geyser Overrun</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Simulates water heater running continuously for &gt;90 minutes during morning peak.
            </p>
          </button>

          <button
            onClick={() => triggerAnomaly('idle_leak')}
            className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-all space-y-1"
          >
            <div className="flex items-center gap-2 font-bold text-blue-800 text-xs">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Workstation Standby Leak</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Simulates high phantom load and idle cluster during non-operational weekend hours.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimulatorPage;
