import React from 'react';
import { FileQuestion, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  title = "No data available",
  description = "Connect the backend or import digital consumption data to begin analysis.",
  icon: Icon = FileQuestion,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-forest-800 dark:text-emerald-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = "Failed to load data",
  description = "An error occurred while communicating with the consumption analysis service.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">{title}</h4>
      <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} icon={RefreshCw} className="mt-4 border-rose-300 text-rose-800 hover:bg-rose-100">
          Retry Action
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
