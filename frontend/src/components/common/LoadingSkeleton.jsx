import React from 'react';

const LoadingSkeleton = ({ rows = 3, className = '' }) => {
  return (
    <div className={`w-full animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
