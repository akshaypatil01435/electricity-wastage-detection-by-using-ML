// 24-Hour ML Consumption Forecast
export const MOCK_24H_PREDICTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = `${i.toString().padStart(2, '0')}:00`;
  let expected = 0.6;
  if (i >= 6 && i <= 9) expected = 1.6;
  else if (i >= 10 && i <= 17) expected = 1.4;
  else if (i >= 18 && i <= 22) expected = 2.2;

  const predicted = +(expected + (Math.sin(i / 3) * 0.2)).toFixed(2);
  const upper = +(predicted * 1.15).toFixed(2);
  const lower = +(predicted * 0.85).toFixed(2);

  return {
    time: hour,
    predicted,
    expected,
    upperConfidence: upper,
    lowerConfidence: lower,
    historicalAvg: +(expected * 0.95).toFixed(2)
  };
});

// 7-Day ML Consumption Forecast
export const MOCK_7D_PREDICTIONS = [
  { label: "Tomorrow", date: "2026-08-24", predicted: 18.4, expected: 17.0, upperConfidence: 20.2, lowerConfidence: 16.5, confidence: 91 },
  { label: "Day 2", date: "2026-08-25", predicted: 17.8, expected: 16.8, upperConfidence: 19.8, lowerConfidence: 16.0, confidence: 89 },
  { label: "Day 3", date: "2026-08-26", predicted: 18.1, expected: 16.5, upperConfidence: 20.0, lowerConfidence: 16.2, confidence: 88 },
  { label: "Day 4", date: "2026-08-27", predicted: 19.5, expected: 17.2, upperConfidence: 21.6, lowerConfidence: 17.4, confidence: 86 },
  { label: "Day 5", date: "2026-08-28", predicted: 20.2, expected: 18.0, upperConfidence: 22.5, lowerConfidence: 18.0, confidence: 85 },
  { label: "Day 6 (Sat)", date: "2026-08-29", predicted: 24.1, expected: 21.0, upperConfidence: 26.8, lowerConfidence: 21.5, confidence: 84 },
  { label: "Day 7 (Sun)", date: "2026-08-30", predicted: 23.5, expected: 20.5, upperConfidence: 26.0, lowerConfidence: 21.0, confidence: 83 }
];

// 30-Day ML Consumption Forecast Summary
export const MOCK_30D_PREDICTIONS = {
  totalPredictedKWh: 428.5,
  expectedBaselineKWh: 395.0,
  predictedCostINR: 3213.75,
  potentialSavingsKWh: 33.5,
  potentialSavingsINR: 251.25,
  modelConfidence: 87,
  trendDirection: "Increasing (+3.2% vs last cycle)",
  modelName: "Isolation Forest + Seasonal ARIMA Forecaster"
};
