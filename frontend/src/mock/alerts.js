export const MOCK_ALERTS = [
  {
    id: "alt_01",
    type: "Critical Wastage",
    severity: "CRITICAL",
    title: "Critical Night Anomaly Detected",
    message: "Digital consumption between 22:00-23:00 reached 2.8 kWh (+155% vs baseline 1.1 kWh). Probable AC left unattended.",
    timestamp: "2026-08-23 22:15",
    read: false,
    kwhImpact: 1.7,
    costImpact: 12.75,
    category: "wastage"
  },
  {
    id: "alt_02",
    type: "Abnormal Consumption",
    severity: "HIGH",
    title: "Geyser Usage Exceeded Normal Window",
    message: "Morning water heater load exceeded 90 minutes. Baseline is 25 minutes.",
    timestamp: "2026-08-23 08:45",
    read: false,
    kwhImpact: 1.2,
    costImpact: 9.00,
    category: "abnormal"
  },
  {
    id: "alt_03",
    type: "High Consumption",
    severity: "MEDIUM",
    title: "Mid-day Consumption Spike",
    message: "14:00 consumption reached 3.1 kWh due to simultaneous cooling and workstation loads.",
    timestamp: "2026-08-23 14:10",
    read: false,
    kwhImpact: 1.3,
    costImpact: 9.75,
    category: "high"
  },
  {
    id: "alt_04",
    type: "Prediction Warning",
    severity: "MEDIUM",
    title: "Monthly Budget Threshold Warning",
    message: "ML forecast predicts month-end consumption of 428.5 kWh, nearing your 450 kWh monthly energy goal.",
    timestamp: "2026-08-23 10:00",
    read: false,
    kwhImpact: 0,
    costImpact: 0,
    category: "prediction"
  },
  {
    id: "alt_05",
    type: "Energy Recommendation",
    severity: "LOW",
    title: "New Energy Optimization Available",
    message: "You can save up to ₹180/mo by raising AC setpoint from 20°C to 24°C.",
    timestamp: "2026-08-22 18:30",
    read: true,
    kwhImpact: 24.0,
    costImpact: 180.00,
    category: "recommendation"
  },
  {
    id: "alt_06",
    type: "System Notification",
    severity: "LOW",
    title: "Isolation Forest Model v1.0 Synchronized",
    message: "ML Anomaly scoring threshold calibrated to 0.60 based on recent 14-day digital pattern.",
    timestamp: "2026-08-22 03:00",
    read: true,
    kwhImpact: 0,
    costImpact: 0,
    category: "system"
  }
];
