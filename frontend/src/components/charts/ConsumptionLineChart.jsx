import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceDot
} from 'recharts';
import { formatKWh } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const actual = payload.find(p => p.dataKey === 'actual')?.value;
    const expected = payload.find(p => p.dataKey === 'expected')?.value;
    const isAnomaly = payload[0]?.payload?.anomaly || payload[0]?.payload?.isAnomaly;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-1">
        <div className="flex items-center justify-between gap-4 font-bold text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-100 dark:border-slate-800">
          <span>{label}</span>
          {isAnomaly && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 font-bold">
              Anomaly
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-700 dark:text-emerald-400 font-semibold">
          <span>Actual Usage:</span>
          <span>{formatKWh(actual)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
          <span>Expected Baseline:</span>
          <span>{formatKWh(expected)}</span>
        </div>
        {actual !== undefined && expected !== undefined && actual > expected && (
          <div className="pt-1 text-[11px] text-rose-600 font-semibold flex justify-between">
            <span>Excess / Wastage:</span>
            <span>+{(actual - expected).toFixed(1)} kWh</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ConsumptionLineChart = ({ data = [], height = 300, xKey = "time" }) => {
  // Find anomaly points for reference markers
  const anomalyPoints = data.filter(d => d.anomaly || d.isAnomaly);

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#166534" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
          
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          />
          
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val}`}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />

          <Area
            type="monotone"
            name="Expected Baseline"
            dataKey="expected"
            stroke="#94a3b8"
            strokeWidth={1.8}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#expectedGradient)"
          />

          <Area
            type="monotone"
            name="Actual Digital Consumption"
            dataKey="actual"
            stroke="#166534"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#actualGradient)"
          />

          {/* Anomaly Outlier Dots */}
          {anomalyPoints.map((pt, i) => (
            <ReferenceDot
              key={i}
              x={pt[xKey]}
              y={pt.actual}
              r={5}
              fill="#e11d48"
              stroke="#ffffff"
              strokeWidth={2}
              isFront={true}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsumptionLineChart;
