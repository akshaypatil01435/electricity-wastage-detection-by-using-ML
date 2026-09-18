export const MOCK_WASTAGE_SUMMARY = {
  wastageProbability: 78,
  anomalyScore: 0.84,
  severity: "HIGH",
  detectionStatus: "Active",
  totalWastageKWh: 23.8,
  estimatedCostLoss: 178.5,
  anomaliesDetectedToday: 3,
  resolvedCount: 12
};

export const MOCK_ANOMALIES = [
  {
    id: "ANOM-2026-0801",
    date: "2026-08-23",
    time: "22:00",
    consumption: 2.8,
    expected: 1.1,
    differenceKWh: 1.7,
    differencePercent: "+155%",
    anomalyScore: 0.94,
    severity: "CRITICAL",
    status: "Unresolved",
    appliance: "Air Conditioner / Heavy Load",
    reason: "Usage occurred during historically low-consumption hours with extreme deviation from expected baseline.",
    explanationDetails: {
      baselineDeviation: "+155%",
      historicalAverage: "1.10 kWh",
      actualUsage: "2.80 kWh",
      context: "Night hours (22:00 - 05:00) standard baseline is <1.2 kWh. Load characteristic suggests unmonitored compressor cycle."
    }
  },
  {
    id: "ANOM-2026-0802",
    date: "2026-08-23",
    time: "08:00",
    consumption: 2.4,
    expected: 1.2,
    differenceKWh: 1.2,
    differencePercent: "+100%",
    anomalyScore: 0.82,
    severity: "HIGH",
    status: "Investigating",
    appliance: "Water Heater",
    reason: "Consumption increased significantly compared with the normal morning preparation pattern.",
    explanationDetails: {
      baselineDeviation: "+100%",
      historicalAverage: "1.20 kWh",
      actualUsage: "2.40 kWh",
      context: "Geyser active continuously for >90 mins during peak tariff interval."
    }
  },
  {
    id: "ANOM-2026-0803",
    date: "2026-08-23",
    time: "14:00",
    consumption: 3.1,
    expected: 1.8,
    differenceKWh: 1.3,
    differencePercent: "+72%",
    anomalyScore: 0.76,
    severity: "MEDIUM",
    status: "Unresolved",
    appliance: "Computer & AC",
    reason: "Current consumption exceeds expected afternoon baseline due to multiple simultaneous high-draw loads.",
    explanationDetails: {
      baselineDeviation: "+72%",
      historicalAverage: "1.80 kWh",
      actualUsage: "3.10 kWh",
      context: "Concurrent cooling and computing loads during mid-day peak solar heat."
    }
  },
  {
    id: "ANOM-2026-0804",
    date: "2026-08-22",
    time: "03:00",
    consumption: 1.9,
    expected: 0.5,
    differenceKWh: 1.4,
    differencePercent: "+280%",
    anomalyScore: 0.96,
    severity: "CRITICAL",
    status: "Resolved",
    appliance: "Lighting & Electronics",
    reason: "Repeated abnormal usage detected in deep sleep window (03:00 AM).",
    explanationDetails: {
      baselineDeviation: "+280%",
      historicalAverage: "0.50 kWh",
      actualUsage: "1.90 kWh",
      context: "High phantom standby power and ambient illumination left active overnight."
    }
  },
  {
    id: "ANOM-2026-0805",
    date: "2026-08-21",
    time: "11:00",
    consumption: 2.7,
    expected: 1.4,
    differenceKWh: 1.3,
    differencePercent: "+93%",
    anomalyScore: 0.79,
    severity: "HIGH",
    status: "Resolved",
    appliance: "Washing Machine",
    reason: "Extended high heat cycle during non-scheduled operation window.",
    explanationDetails: {
      baselineDeviation: "+93%",
      historicalAverage: "1.40 kWh",
      actualUsage: "2.70 kWh",
      context: "Multiple consecutive hot water washing cycles detected."
    }
  },
  {
    id: "ANOM-2026-0806",
    date: "2026-08-20",
    time: "17:00",
    consumption: 2.2,
    expected: 1.5,
    differenceKWh: 0.7,
    differencePercent: "+47%",
    anomalyScore: 0.58,
    severity: "MEDIUM",
    status: "Resolved",
    appliance: "Television / Audio",
    reason: "Slight elevation above evening baseline.",
    explanationDetails: {
      baselineDeviation: "+47%",
      historicalAverage: "1.50 kWh",
      actualUsage: "2.20 kWh",
      context: "Home entertainment unit running concurrently with kitchen load."
    }
  }
];
