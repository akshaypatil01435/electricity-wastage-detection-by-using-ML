import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

const StatusBadge = ({ status = 'Normal', size = 'md', className = '' }) => {
  const norm = String(status).toUpperCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  let Icon = Info;

  if (norm.includes('CRITICAL')) {
    styles = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60";
    Icon = ShieldAlert;
  } else if (norm.includes('HIGH') || norm.includes('WASTAGE')) {
    styles = "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60";
    Icon = AlertTriangle;
  } else if (norm.includes('MEDIUM') || norm.includes('WARNING') || norm.includes('INVESTIGATING')) {
    styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60";
    Icon = AlertCircle;
  } else if (norm.includes('NORMAL') || norm.includes('RESOLVED') || norm.includes('ACTIVE') || norm.includes('OPTIMAL') || norm.includes('GOOD') || norm.includes('SUCCESS')) {
    styles = "bg-emerald-50 text-forest-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60";
    Icon = ShieldCheck;
  }

  const sizes = {
    sm: "text-[11px] px-2 py-0.5 gap-1 font-medium",
    md: "text-xs px-2.5 py-1 gap-1.5 font-semibold",
    lg: "text-sm px-3 py-1.5 gap-2 font-semibold"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs ${sizes[size] || sizes.md} ${styles} ${className}`}
    >
      <Icon className={`${iconSizes[size] || iconSizes.md} shrink-0`} />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
