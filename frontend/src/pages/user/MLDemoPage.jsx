import React, { useState } from 'react';
import {
  FlaskConical,
  BrainCircuit,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  HelpCircle,
  Cpu
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { wastageService } from '../../services/wastageService';
import { formatKWh } from '../../utils/formatters';

const MLDemoPage = () => {
  const [formData, setFormData] = useState({
    hour: 22,
    day: 'Weekday',
    consumption: 2.8,
    previousConsumption: 1.2,
    expectedBaseline: 1.1,
    duration: 90,
    activeAppliances: ['Air Conditioner']
  });

  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const availableAppliances = [
    'Air Conditioner',
    'Water Heater (Geyser)',
    'Refrigerator',
    'Washing Machine',
    'Computer Workstation',
    'Lighting & Fans',
    'Television'
  ];

  const toggleAppliance = (app) => {
    setFormData((prev) => {
      const exists = prev.activeAppliances.includes(app);
      if (exists) {
        return { ...prev, activeAppliances: prev.activeAppliances.filter(a => a !== app) };
      } else {
        return { ...prev, activeAppliances: [...prev.activeAppliances, app] };
      }
    });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const mlRes = await wastageService.analyzeConsumption(formData);
      setResult(mlRes);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        category="INTERACTIVE INFERENCE TESTBENCH"
        title="Try ML Wastage Detection"
        subtitle="Manually supply digital consumption parameters to test the Isolation Forest anomaly classifier and observe explainable diagnosis outputs."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Inference Input Parameters
              </h3>
              <p className="text-xs text-slate-500">Configure synthetic load and temporal features</p>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hour of Day (0–23)
                </label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Day of Week
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                >
                  <option value="Weekday">Weekday (Mon–Fri)</option>
                  <option value="Weekend">Weekend (Sat–Sun)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Consumption (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.consumption}
                  onChange={(e) => setFormData({ ...formData, consumption: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800 font-bold text-forest-800 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Expected Baseline (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.expectedBaseline}
                  onChange={(e) => setFormData({ ...formData, expectedBaseline: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Previous Hour Load (kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.previousConsumption}
                  onChange={(e) => setFormData({ ...formData, previousConsumption: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Continuous Duration (Mins)
                </label>
                <input
                  type="number"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>
            </div>

            {/* Appliance Chips */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Active Appliance Load Attribution
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableAppliances.map((app) => {
                  const isSelected = formData.activeAppliances.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleAppliance(app)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-forest-800 text-white shadow-2xs font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {app}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={analyzing}
              icon={BrainCircuit}
              className="w-full py-3 text-sm font-semibold rounded-xl"
            >
              Analyze Consumption with ML
            </Button>
          </form>
        </div>

        {/* Right: Output Diagnostic Card */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 dark:text-emerald-400">
                    ML Model Output
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {result.isWastage ? "Potential Wastage Detected" : "Normal Consumption Pattern"}
                  </h3>
                </div>
                <StatusBadge status={result.severity} size="lg" />
              </div>

              {/* 3 Highlight Scores */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Anomaly Score</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {result.anomalyScore.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-slate-400">Threshold: 0.60</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-bold uppercase text-forest-800 dark:text-emerald-300">Wastage Prob.</span>
                  <p className="text-2xl font-black text-forest-900 dark:text-emerald-300 mt-1">
                    {result.wastageProbability}%
                  </p>
                  <span className="text-[10px] text-slate-400">Confidence: {result.confidence}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Deviation</span>
                  <p className={`text-2xl font-black mt-1 ${result.isWastage ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {result.differencePercent}
                  </p>
                  <span className="text-[10px] text-slate-400">vs Baseline</span>
                </div>
              </div>

              {/* Explainable AI Rationale */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                  <span>Explainable AI Diagnostic Rationale:</span>
                </span>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Actionable Advice */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2 text-xs">
                <span className="font-bold text-forest-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                  <span>Recommended Action:</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  {result.recommendations[0]}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Ready for Inference Execution
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your input parameters on the left and click "Analyze Consumption with ML" to run the decision space classifier.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLDemoPage;
