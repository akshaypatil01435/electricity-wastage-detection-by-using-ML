import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatKWh } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actual = payload.find(p => p.dataKey === 'actual')?.value;
    const wastage = payload.find(p => p.dataKey === 'wastage')?.value;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-emerald-700 dark:text-emerald-400 font-bold">Total: {formatKWh(actual)}</p>
        <p className="text-rose-600 dark:text-rose-400 font-bold">Wastage Detected: {formatKWh(wastage)}</p>
      </div>
    );
  }
  return null;
};

const WastageAreaChart = ({ data = [], height = 280, xKey = "day" }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
          <Bar name="Actual Consumption" dataKey="actual" fill="#166534" radius={[4, 4, 0, 0]} />
          <Bar name="Detected Wastage" dataKey="wastage" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WastageAreaChart;
