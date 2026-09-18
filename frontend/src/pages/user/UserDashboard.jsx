import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  IndianRupee,
  ShieldCheck,
  Bell,
  ArrowRight,
  PlayCircle,
  Sparkles,
  ExternalLink,
  BrainCircuit
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import ConsumptionLineChart from '../../components/charts/ConsumptionLineChart';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ExplainableCard from '../../components/wastage/ExplainableCard';
import { consumptionService } from '../../services/consumptionService';
import { wastageService } from '../../services/wastageService';
import { recommendationService } from '../../services/recommendationService';
import { formatKWh, formatCurrency } from '../../utils/formatters';

const UserDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('day');
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [kpiData, consumption, anomalies, recs] = await Promise.all([
          consumptionService.getDashboardKPIs(),
          consumptionService.getConsumptionData(timeframe),
          wastageService.getAnomalies('all'),
          recommendationService.getRecommendations()
        ]);
        setKpis(kpiData);
        setChartData(consumption);
        setRecentAnomalies(anomalies.slice(0, 3));
        setRecommendations(recs.filter(r => r.status === 'Active').slice(0, 2));
      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [timeframe]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        category="ENERGY INTELLIGENCE OVERVIEW"
        title="Consumption & Wastage Dashboard"
        subtitle="Real-time digital electricity consumption telemetry, anomaly detection, and AI optimization recommendations."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/simulator">
              <Button size="sm" variant="secondary" icon={PlayCircle}>
                Simulator
              </Button>
            </Link>
            <Link to="/wastage">
              <Button size="sm" variant="primary" icon={BrainCircuit}>
                ML Wastage Details
              </Button>
            </Link>
          </div>
        }
      />

      {/* 6 Core KPI Cards matching prompt specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Today's Consumption"
          value="18.7"
          unit="kWh"
          change="+4.2%"
          trend="up"
          comparison="vs. yesterday"
          icon={Zap}
          iconBg="bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          sparkline={[12, 14, 15, 16, 17, 18.7]}
        />

        <StatCard
          title="This Month"
          value="412.5"
          unit="kWh"
          change="-2.8%"
          trend="down"
          comparison="Target: 450 kWh"
          icon={TrendingUp}
          iconBg="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
          sparkline={[380, 400, 420, 415, 412.5]}
        />

        <StatCard
          title="Wastage Detected"
          value="23.8"
          unit="kWh"
          change="+12.5%"
          trend="up"
          comparison="Est. loss: ₹178.50"
          icon={AlertTriangle}
          iconBg="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
          sparkline={[10, 14, 18, 16, 23.8]}
          highlight={true}
        />

        <StatCard
          title="Estimated Cost"
          value="3,284"
          unit="₹"
          change="+3.1%"
          trend="up"
          comparison="₹7.50 / kWh"
          icon={IndianRupee}
          iconBg="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
          sparkline={[2900, 3100, 3200, 3284]}
        />

        <StatCard
          title="Efficiency Score"
          value="82"
          unit="%"
          change="+5.0%"
          trend="up"
          comparison="Benchmark: 85%"
          icon={ShieldCheck}
          iconBg="bg-forest-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />

        <StatCard
          title="Active Alerts"
          value="4"
          unit="Alerts"
          change="1 Critical"
          trend="down"
          comparison="Requires review"
          icon={Bell}
          iconBg="bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
        />
      </div>

      {/* Main Consumption Telemetry vs Baseline Chart */}
      <ChartCard
        title="Digital Electricity Consumption vs Expected Baseline"
        subtitle="Red markers highlight anomalies where actual consumption exceeded the Isolation Forest statistical boundary."
        action={
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['day', 'week', 'month', 'year'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        }
      >
        <ConsumptionLineChart
          data={chartData}
          xKey={timeframe === 'day' ? 'time' : timeframe === 'week' ? 'day' : timeframe === 'month' ? 'date' : 'month'}
          height={320}
        />
      </ChartCard>

      {/* 2-Column Section: Explainable AI Diagnosis + Recommendations & Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Explainable AI Diagnosis Panel */}
        <div className="lg:col-span-7">
          <ExplainableCard />
        </div>

        {/* Right: Recommendations & Recent Anomalies */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Priority Recommendation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                <span>AI Energy Recommendation</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                HIGH PRIORITY
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
              "Your digital electricity consumption between 11 PM and 2 AM is unusually high (+155% vs baseline)."
            </p>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-xs text-forest-900 dark:text-emerald-200">
              <p className="font-bold">Suggested Action:</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Review appliances left running overnight. Enabling automated AC timers can eliminate unmonitored cooling cycles.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-forest-800 dark:text-emerald-400">
                Est. Savings: ₹138.75 / mo
              </span>
              <Link to="/recommendations" className="font-bold text-xs text-slate-700 dark:text-slate-300 hover:text-forest-800 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Detected Anomalies list */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Detected Anomalies
              </h4>
              <Link to="/wastage" className="text-xs font-semibold text-forest-800 dark:text-emerald-400 hover:underline">
                Full Details →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAnomalies.map((anom) => (
                <div key={anom.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{anom.time}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 dark:text-slate-300">{anom.appliance}</span>
                    </div>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                      {formatKWh(anom.consumption)} ({anom.differencePercent} vs baseline)
                    </p>
                  </div>
                  <StatusBadge status={anom.severity} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
