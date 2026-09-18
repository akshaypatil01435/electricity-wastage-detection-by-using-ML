import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';

const DemoBanner = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!APP_CONFIG.demoMode) return null;

  return (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-forest-800 border border-emerald-200/80 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80 transition-colors shadow-2xs"
        role="button"
        tabIndex={0}
        aria-label="Demo Data Mode"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Demo Data</span>
        <HelpCircle className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
      </div>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-50 border border-slate-700 leading-relaxed">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              This dashboard is currently displaying simulated consumption data. Connect the backend to use actual project data.
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Spring Boot REST API</span>
            <span className="text-emerald-400 font-mono">Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoBanner;
