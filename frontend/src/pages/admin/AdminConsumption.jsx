import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Users, Zap, Layers } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import ConsumptionLineChart from '../../components/charts/ConsumptionLineChart';
import StatCard from '../../components/common/StatCard';
import { consumptionService } from '../../services/consumptionService';
import { formatKWh } from '../../utils/formatters';

const AdminConsumption = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await consumptionService.getConsumptionData(timeframe);
        setChartData(data);
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
        category="AGGREGATE TELEMETRY"
        title="Global Consumption Data"
        subtitle="System-wide aggregate electricity consumption profiles, load factors, and grid-scale patterns."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aggregated Load"
          value="48,921"
          unit="kWh"
          change="+14.2%"
          trend="up"
          comparison="Past 30 Days"
          icon={Zap}
          iconBg="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
        />
        <StatCard
          title="Avg Per Household"
          value="39.2"
          unit="kWh/day"
          change="Standard nominal"
          trend="neutral"
          comparison="1,248 accounts"
          icon={Users}
          iconBg="bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />
        <StatCard
          title="Identified Wastage"
          value="3,428"
          unit="kWh"
          change="7.0% of total"
          trend="down"
          comparison="Est Loss: ₹25,710"
          icon={TrendingUp}
          iconBg="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
        />
        <StatCard
          title="System Load Factor"
          value="74.5%"
          unit=""
          change="Optimal"
          trend="up"
          comparison="Grid health index"
          icon={Layers}
          iconBg="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
        />
      </div>

      <ChartCard
        title="Global Aggregate Consumption vs Baseline"
        subtitle="Multi-tenant electricity volume telemetry."
        action={
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['day', 'week', 'month', 'year'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  timeframe === tf ? 'bg-forest-800 text-white font-bold' : 'text-slate-400 hover:text-white'
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
          height={340}
        />
      </ChartCard>
    </div>
  );
};

export default AdminConsumption;
