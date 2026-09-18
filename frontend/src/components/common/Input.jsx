import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full rounded-xl border transition-all text-sm py-2.5 px-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-forest-700 dark:focus:ring-forest-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${isPassword ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900'
              : 'border-slate-300 dark:border-slate-700'
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
};

export default Input;
