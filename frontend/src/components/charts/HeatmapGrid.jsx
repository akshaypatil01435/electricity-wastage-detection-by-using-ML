import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DAYS_OF_WEEK, HOURS_LIST } from '../../mock/consumption';

const HeatmapGrid = ({ data = [], onCellClick }) => {
  const [selectedCell, setSelectedCell] = useState(null);

  const getHeatmapColor = (intensity, isAnomaly) => {
    if (isAnomaly) {
      return 'bg-rose-500 hover:bg-rose-600 text-white';
    }
    if (intensity > 75) return 'bg-forest-800 hover:bg-forest-900 text-white';
    if (intensity > 50) return 'bg-forest-600 hover:bg-forest-700 text-white';
    if (intensity > 30) return 'bg-forest-400 hover:bg-forest-500 text-slate-900';
    if (intensity > 15) return 'bg-forest-200 hover:bg-forest-300 text-slate-800';
    return 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-500';
  };

  return (
    <div className="w-full space-y-4">
      {/* Grid container with horizontal scroll on small devices */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[700px] space-y-2">
          {/* Header Hour Labels */}
          <div className="grid grid-cols-25 gap-1 text-[10px] text-slate-400 font-semibold text-center items-center">
            <div className="text-left font-bold text-slate-500 dark:text-slate-400">Day</div>
            {HOURS_LIST.map((hr, idx) => (
              <div key={hr} className="truncate" title={hr}>
                {idx % 3 === 0 ? `${idx}h` : '·'}
              </div>
            ))}
          </div>

          {/* Rows */}
          {data.map((row) => (
            <div key={row.day} className="grid grid-cols-25 gap-1 items-center">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                {row.day.substring(0, 3)}
              </div>
              {row.hours.map((cell) => {
                const isSelected = selectedCell?.day === row.day && selectedCell?.hour === cell.hour;
                return (
                  <motion.div
                    key={cell.hour}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    onClick={() => {
                      setSelectedCell({ day: row.day, ...cell });
                      if (onCellClick) onCellClick({ day: row.day, ...cell });
                    }}
                    title={`${row.day} at ${cell.hour}: ${cell.value} kWh ${cell.isAnomaly ? '(Anomaly Detected)' : ''}`}
                    className={`h-7 rounded cursor-pointer transition-colors duration-150 flex items-center justify-center text-[9px] font-bold select-none ${getHeatmapColor(
                      cell.intensity,
                      cell.isAnomaly
                    )} ${isSelected ? 'ring-2 ring-slate-900 dark:ring-white scale-110 z-20' : ''}`}
                  >
                    {cell.isAnomaly ? '!' : ''}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Inspector & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {selectedCell ? (
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-800 dark:text-white">
              {selectedCell.day}, {selectedCell.hour}:
            </span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {selectedCell.value} kWh
            </span>
            {selectedCell.isAnomaly && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                Outlier Spike
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-400">Click or hover over any hour cell to inspect digital load.</span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 shrink-0">
          <span>Low</span>
          <div className="flex gap-1 items-center">
            <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="w-3.5 h-3.5 rounded bg-forest-200" />
            <div className="w-3.5 h-3.5 rounded bg-forest-400" />
            <div className="w-3.5 h-3.5 rounded bg-forest-600" />
            <div className="w-3.5 h-3.5 rounded bg-forest-800" />
            <div className="w-3.5 h-3.5 rounded bg-rose-500" />
          </div>
          <span>High / Anomaly</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapGrid;
