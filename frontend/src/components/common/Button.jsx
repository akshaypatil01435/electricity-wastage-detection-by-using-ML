import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const variants = {
    primary: "bg-forest-800 hover:bg-forest-900 text-white shadow-sm focus-visible:ring-forest-700 dark:bg-forest-700 dark:hover:bg-forest-600",
    secondary: "bg-emerald-50 text-forest-800 hover:bg-emerald-100 border border-emerald-200/80 focus-visible:ring-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 dark:hover:bg-emerald-950/60",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus-visible:ring-forest-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/60",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-300 dark:hover:bg-slate-800",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:ring-rose-500",
    dark: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5",
    md: "text-sm px-4 py-2 rounded-xl gap-2",
    lg: "text-base px-6 py-2.5 rounded-xl gap-2.5 font-semibold"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
