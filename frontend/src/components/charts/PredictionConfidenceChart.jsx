import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatKWh } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const predicted = payload.find(p => p.dataKey === 'predicted')?.value;
    const expected = payload.find(p => p.dataKey === 'expected')?.value;
    const upper = payload.find(p => p.dataKey === 'upperConfidence')?.value;
    const lower = payload.find(p => p.dataKey === 'lowerConfidence')?.value;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1">{label}</p>
        <p className="text-forest-700 dark:text-emerald-400 font-bold">Predicted: {formatKWh(predicted)}</p>
        <p className="text-slate-500 dark:text-slate-400">Baseline Expected: {formatKWh(expected)}</p>
        {upper && lower && (
          <p className="text-[10px] text-slate-400">Confidence Band: {lower} - {upper} kWh</p>
        )}
      </div>
    );
  }
  return null;
};

const PredictionConfidenceChart = ({ data = [], height = 300, xKey = "time" }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
          
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
          />
          
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />

          <Area
            type="monotone"
            name="Upper Confidence (95%)"
            dataKey="upperConfidence"
            stroke="#10b981"
            strokeDasharray="2 2"
            strokeWidth={1}
            fill="url(#confidenceBand)"
          />

          <Area
            type="monotone"
            name="Expected Baseline"
            dataKey="expected"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />

          <Area
            type="monotone"
            name="ML Predicted Consumption"
            dataKey="predicted"
            stroke="#166534"
            strokeWidth={2.5}
            fill="none"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionConfidenceChart;
