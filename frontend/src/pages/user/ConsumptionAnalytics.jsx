import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Zap,
  Info,
  Clock
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import ConsumptionLineChart from '../../components/charts/ConsumptionLineChart';
import WastageAreaChart from '../../components/charts/WastageAreaChart';
import HeatmapGrid from '../../components/charts/HeatmapGrid';
import StatCard from '../../components/common/StatCard';
import { consumptionService } from '../../services/consumptionService';
import { formatKWh } from '../../utils/formatters';

const ConsumptionAnalytics = () => {
  const [timeframe, setTimeframe] = useState('day');
  const [chartType, setChartType] = useState('area'); // area or bar
  const [consumptionData, setConsumptionData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [data, heatmap] = await Promise.all([
          consumptionService.getConsumptionData(timeframe),
          consumptionService.getHeatmapData()
        ]);
        setConsumptionData(data);
        setHeatmapData(heatmap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeframe]);

  return (
    <div className="space-y-8">
      <PageHeader
        category="TIME-SERIES CONSUMPTION"
        title="Consumption Analytics"
        subtitle="Visualize, filter, and inspect digital electricity load profiles, peak usage periods, and anomalous deviations."
      />

      {/* Snapshot Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Peak Interval Load"
          value="3.1"
          unit="kWh"
          change="At 14:00 (Afternoon)"
          trend="up"
          comparison="Baseline: 1.8 kWh"
          icon={Zap}
          iconBg="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
        />
        <StatCard
          title="Off-Peak Average"
          value="0.65"
          unit="kWh"
          change="02:00 - 05:00"
          trend="neutral"
          comparison="Nominal deep sleep load"
          icon={Clock}
          iconBg="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
        />
        <StatCard
          title="Daily Average"
          value="18.7"
          unit="kWh"
          change="+4.2%"
          trend="up"
          comparison="Target: 15.0 kWh/day"
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />
        <StatCard
          title="Load Factor"
          value="68.2"
          unit="%"
          change="Optimal range"
          trend="neutral"
          comparison="Avg Load / Peak Load"
          icon={Layers}
          iconBg="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
        />
      </div>

      {/* Main Consumption Telemetry Chart with Type and Timeframe Switchers */}
      <ChartCard
        title="Digital Consumption Profile"
        subtitle="Explore actual consumption versus statistical baselines across customizable time intervals."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {/* Chart Type Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Line / Area
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartType === 'bar'
                    ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Wastage Bars
              </button>
            </div>

            {/* Timeframe Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {['day', 'week', 'month', 'year'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all ${
                    timeframe === tf
                      ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {chartType === 'area' ? (
          <ConsumptionLineChart
            data={consumptionData}
            xKey={timeframe === 'day' ? 'time' : timeframe === 'week' ? 'day' : timeframe === 'month' ? 'date' : 'month'}
            height={340}
          />
        ) : (
          <WastageAreaChart
            data={consumptionData}
            xKey={timeframe === 'day' ? 'time' : timeframe === 'week' ? 'day' : timeframe === 'month' ? 'date' : 'month'}
            height={340}
          />
        )}
      </ChartCard>

      {/* 24x7 Heatmap Section */}
      <ChartCard
        title="24x7 Hourly Consumption Heatmap"
        subtitle="Matrix representation of all 168 hours of the week. Darker emerald cells indicate higher load; red cells signify ML-detected anomalous spikes."
      >
        <HeatmapGrid data={heatmapData} />
      </ChartCard>
    </div>
  );
};

export default ConsumptionAnalytics;
