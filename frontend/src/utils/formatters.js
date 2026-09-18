import { APP_CONFIG } from './constants';

export const formatKWh = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return '0.0 kWh';
  return `${Number(val).toFixed(decimals)} kWh`;
};

export const formatCurrency = (val, currency = APP_CONFIG.currency) => {
  if (val === undefined || val === null || isNaN(val)) return `${currency}0`;
  return `${currency}${Number(val).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const formatPercent = (val, decimals = 1, showSign = false) => {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  const sign = showSign && val > 0 ? '+' : '';
  return `${sign}${Number(val).toFixed(decimals)}%`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const calculateCost = (kwh, tariff = APP_CONFIG.tariffPerKWh) => {
  return Number(kwh || 0) * tariff;
};
