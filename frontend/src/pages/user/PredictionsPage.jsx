import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import StatCard from '../../components/common/StatCard';
import PredictionConfidenceChart from '../../components/charts/PredictionConfidenceChart';
import { predictionService } from '../../services/predictionService';
import { formatKWh } from '../../utils/formatters';

const PredictionsPage = () => {
  const [horizon, setHorizon] = useState('24h'); // 24h, 7d, 30d
  const [predictionData, setPredictionData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const res = await predictionService.getPredictions(horizon);
        setPredictionData(res.data);
        setSummary(res.summary);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, [horizon]);

  return (
    <div className="space-y-8">
      <PageHeader
        category="MACHINE LEARNING FORECASTING"
        title="Predictive Consumption Analytics"
        subtitle="Forecasting electricity demand curves with statistical confidence boundaries to prevent budget overruns."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Predicted Next 7 Days"
          value="96.4"
          unit="kWh"
          change="+3.2%"
          trend="up"
          comparison="Expected: 91.0 kWh"
          icon={TrendingUp}
          iconBg="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
        />

        <StatCard
          title="Prediction Confidence"
          value="87%"
          unit=""
          change="Isolation Forest + ARIMA"
          trend="up"
          comparison="Historical fit: R² = 0.92"
          icon={ShieldCheck}
          iconBg="bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />

        <StatCard
          title="Projected Month End"
          value="428.5"
          unit="kWh"
          change="Target: 450 kWh"
          trend="neutral"
          comparison="Estimated Cost: ₹3,214"
          icon={Calendar}
          iconBg="bg-forest-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />

        <StatCard
          title="Preventable Wastage"
          value="33.5"
          unit="kWh"
          change="Potential ₹251 saved"
          trend="up"
          comparison="If recommendations applied"
          icon={Sparkles}
          iconBg="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
        />
      </div>

      {/* Forecast Chart */}
      <ChartCard
        title="ML Demand Trajectory & Confidence Band"
        subtitle="Upper/Lower statistical bounds calculated with 95% confidence interval."
        action={
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {[
              { key: '24h', label: 'Next 24 Hours' },
              { key: '7d', label: 'Next 7 Days' },
              { key: '30d', label: 'Next 30 Days' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setHorizon(tab.key)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  horizon === tab.key
                    ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      >
        <PredictionConfidenceChart
          data={predictionData}
          xKey={horizon === '24h' ? 'time' : 'label'}
          height={320}
        />
      </ChartCard>

      {/* Forecast Explainer Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-forest-800 dark:text-emerald-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>How Predictive Forecasting Works</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The forecast engine combines historical baseline medians with seasonal rolling time-series projections. By modeling scheduled weekday vs. weekend variances, it warns you proactively before unmitigated consumption crosses tariff surcharge brackets.
        </p>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Backend Target: <code className="font-mono text-forest-800 dark:text-emerald-400">GET /api/predictions</code></span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">REST API Ready</span>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPage;
