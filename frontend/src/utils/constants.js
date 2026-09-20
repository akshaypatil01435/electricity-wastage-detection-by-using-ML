export const APP_CONFIG = {
  name: "WattVision AI",
  shortName: "WattVision",
  brandName: "WattVision",
  tagline: "Detect. Understand. Save.",
  subtitle: "Electricity Wastage Detection Using Machine Learning",
  version: "1.0.0",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  // Demo mode is ON by default. Set VITE_DEMO_MODE=false to use the real Spring Boot API.
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  currency: "₹",
  tariffPerKWh: 7.50, // Average cost per kWh in INR (configurable)
  disclaimer: "100% Software-based platform operating on digital, simulated, and imported consumption data. No physical IoT hardware required."
};

export const USER_ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN"
};

export const SEVERITY_LEVELS = {
  LOW: { label: "Low", color: "emerald", bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" },
  MEDIUM: { label: "Medium", color: "amber", bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" },
  HIGH: { label: "High", color: "orange", bg: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800" },
  CRITICAL: { label: "Critical", color: "rose", bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800" }
};

export const ML_MODEL_INFO = {
  name: "Isolation Forest",
  version: "v1.0",
  status: "Active",
  inputFeatures: ["Hour of Day", "Day of Week", "Active Baseline", "Rolling Average (3h)", "Historical Variance"],
  threshold: 0.60,
  metrics: {
    accuracy: 94.2,
    precision: 94.2,
    recall: 91.8,
    f1Score: 93.0,
    detectionRate: 96.4,
    rocAuc: 0.965
  },
  lastTrained: "2026-08-15 03:00 AM",
  trainingDataSize: "142,500 Digital Hourly Samples"
};
