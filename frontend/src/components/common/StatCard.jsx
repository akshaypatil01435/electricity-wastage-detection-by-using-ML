import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  unit,
  change,
  trend = 'neutral', // up, down, neutral
  comparison,
  icon: Icon,
  iconBg = 'bg-emerald-50 text-forest-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  sparkline = [],
  highlight = false,
  className = '',
  onClick
}) => {
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
        highlight ? 'ring-1 ring-forest-700/50' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Footer comparison & change */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {change && (
          <div
            className={`flex items-center gap-1 font-semibold ${
              trend === 'up'
                ? 'text-emerald-700 dark:text-emerald-400'
                : trend === 'down'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}

        {comparison && (
          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
            {comparison}
          </span>
        )}
      </div>

      {/* Mini sparkline visualization */}
      {sparkline && sparkline.length > 0 && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-forest-700/60 dark:bg-emerald-500/60"
            style={{ width: `${Math.min((sparkline[sparkline.length - 1] / Math.max(...sparkline, 1)) * 100, 100)}%` }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
