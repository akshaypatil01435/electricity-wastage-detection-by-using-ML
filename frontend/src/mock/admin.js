export const MOCK_ADMIN_KPIS = {
  totalUsers: 1248,
  activeUsers: 842,
  totalConsumptionAnalyzedKWh: 48921,
  wastageEvents: 3428,
  criticalEvents: 184,
  averageEfficiency: 78.4,
  mlDetectionAccuracy: 94.2
};

export const MOCK_ADMIN_ML_METRICS = {
  algorithm: "Isolation Forest",
  version: "v1.0",
  modelStatus: "Active",
  inputFeatures: "Hour, Day, Consumption, History",
  anomalyScoreRange: "0.0 - 1.0 (higher = anomaly)",
  threshold: 0.60,
  lastTrained: "2026-08-15 03:00 AM",
  trainingDatasetSize: "142,500 Digital Hourly Samples",
  metrics: {
    precision: 94.2,
    recall: 91.8,
    f1Score: 93.0,
    detectionRate: 96.4,
    accuracy: 94.2,
    rocAuc: 0.965
  },
  confusionMatrix: {
    truePositive: 3290,
    falsePositive: 202,
    trueNegative: 135800,
    falseNegative: 3208
  },
  predictionDistribution: [
    { range: "0.0 - 0.2 (Normal)", count: 98400, percentage: 69.1 },
    { range: "0.2 - 0.4 (Nominal)", count: 28600, percentage: 20.1 },
    { range: "0.4 - 0.6 (Elevated)", count: 9100, percentage: 6.4 },
    { range: "0.6 - 0.8 (Wastage)", count: 4200, percentage: 2.9 },
    { range: "0.8 - 1.0 (Critical)", count: 2200, percentage: 1.5 }
  ]
};

export const MOCK_ADMIN_CONSUMPTION_ANALYTICS = {
  monthlyGrowth: [
    { month: "Jan", consumption: 32000, wastage: 2800 },
    { month: "Feb", consumption: 34500, wastage: 2600 },
    { month: "Mar", consumption: 38200, wastage: 3100 },
    { month: "Apr", consumption: 42000, wastage: 4100 },
    { month: "May", consumption: 47800, wastage: 4900 },
    { month: "Jun", consumption: 48921, wastage: 3428 }
  ],
  wastageBySeverity: [
    { name: "Low", value: 1240, color: "#10b981" },
    { name: "Medium", value: 1420, color: "#f59e0b" },
    { name: "High", value: 584, color: "#f97316" },
    { name: "Critical", value: 184, color: "#ef4444" }
  ],
  topWastageAppliances: [
    { name: "Air Conditioners", percentage: 44, totalKWh: 1508.3 },
    { name: "Water Heaters", percentage: 22, totalKWh: 754.2 },
    { name: "Commercial Chillers / Refrigeration", percentage: 16, totalKWh: 548.5 },
    { name: "Workstations & Servers", percentage: 11, totalKWh: 377.1 },
    { name: "Lighting & Others", percentage: 7, totalKWh: 240.0 }
  ]
};
