import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { formatKWh } from '../../utils/formatters';

const COLORS = ['#166534', '#15803d', '#22c55e', '#4ade80', '#0284c7', '#8b5cf6', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-200">{data.name}</p>
        <p className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatKWh(data.consumptionKWh)} ({data.percentage}%)</p>
        <p className="text-slate-500 dark:text-slate-400">Est. Cost: ₹{data.estimatedCost}</p>
      </div>
    );
  }
  return null;
};

const ApplianceDonutChart = ({ appliances = [], height = 280 }) => {
  const chartData = appliances.map(app => ({
    name: app.name,
    value: app.consumptionKWh,
    consumptionKWh: app.consumptionKWh,
    percentage: app.percentage,
    estimatedCost: app.estimatedCost
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ApplianceDonutChart;
