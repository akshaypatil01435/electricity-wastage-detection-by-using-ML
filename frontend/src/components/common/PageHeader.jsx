import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants';

const PageHeader = ({
  title,
  subtitle,
  category,
  actions,
  showDigitalBadge = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800 ${className}`}>
      <div>
        {category && (
          <span className="text-[11px] font-bold uppercase tracking-widest text-forest-700 dark:text-emerald-400 mb-1 block">
            {category}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {showDigitalBadge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-forest-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
              <Cpu className="w-3 h-3" />
              Digital Data
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
