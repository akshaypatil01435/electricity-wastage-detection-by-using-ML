import React from 'react';

const ChartCard = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 ${headerClassName}`}>
          <div>
            {title && (
              <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={`w-full ${bodyClassName}`}>{children}</div>
    </div>
  );
};

export default ChartCard;
