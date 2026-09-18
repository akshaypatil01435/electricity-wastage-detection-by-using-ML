/**
 * Simulated ML Inference Engine (Isolation Forest Logic)
 * Emulates the response structure expected from the upcoming Spring Boot / ML REST API.
 */
export const runMLInference = ({
  hour = 14,
  day = 'Weekday',
  consumption = 2.5,
  previousConsumption = 1.8,
  expectedBaseline = 1.4,
  activeAppliances = ['Air Conditioner'],
  duration = 60
}) => {
  const c = Number(consumption) || 0;
  const exp = Number(expectedBaseline) || 1.2;
  const prev = Number(previousConsumption) || exp;
  const hr = Number(hour) || 12;

  // Deviation ratio
  const ratio = (c - exp) / Math.max(exp, 0.1);
  const surgeRatio = (c - prev) / Math.max(prev, 0.1);

  // Time of day multiplier: Night hours (23:00 - 05:00) have lower normal tolerance
  const isNight = hr >= 23 || hr <= 5;
  const nightFactor = isNight ? 1.4 : 1.0;

  // Base raw score
  let rawScore = 0.25;
  if (ratio > 0) {
    rawScore += Math.min(ratio * 0.45 * nightFactor, 0.65);
  } else {
    rawScore = Math.max(0.1, 0.25 + ratio * 0.15);
  }

  // Factor in rapid sudden surge
  if (surgeRatio > 0.8) {
    rawScore += 0.1;
  }

  // Appliance duration stress factor
  if (duration > 120 && c > 2.0) {
    rawScore += 0.08;
  }

  // Clamp anomaly score between 0.05 and 0.98
  const anomalyScore = Math.min(Math.max(Number(rawScore.toFixed(2)), 0.05), 0.98);
  const wastageProbability = Math.round(anomalyScore * 100);

  // Severity classification
  let severity = 'LOW';
  let isWastage = false;

  if (anomalyScore >= 0.78) {
    severity = 'CRITICAL';
    isWastage = true;
  } else if (anomalyScore >= 0.60) {
    severity = 'HIGH';
    isWastage = true;
  } else if (anomalyScore >= 0.45) {
    severity = 'MEDIUM';
    isWastage = false;
  } else {
    severity = 'LOW';
    isWastage = false;
  }

  // Generate Explainable AI rationale
  const reasons = [];
  const pctOver = Math.round(Math.abs(ratio) * 100);

  if (c > exp) {
    reasons.push(`Current consumption (${c.toFixed(1)} kWh) exceeds the expected baseline (${exp.toFixed(1)} kWh) by +${pctOver}%.`);
  } else {
    reasons.push(`Current consumption is within standard statistical bounds of the expected baseline (${exp.toFixed(1)} kWh).`);
  }

  if (isNight && c > 1.0) {
    reasons.push(`Usage occurred during historically low-consumption night hours (${hr.toString().padStart(2, '0')}:00), which triggers high anomaly sensitivity.`);
  }

  if (surgeRatio > 0.7) {
    reasons.push(`Sudden power surge detected compared to previous interval (+${Math.round(surgeRatio * 100)}%).`);
  }

  if (activeAppliances && activeAppliances.length > 0) {
    reasons.push(`High load contribution from active profile: ${activeAppliances.join(', ')}.`);
  }

  const recommendations = [];
  if (isWastage) {
    if (activeAppliances.includes('Air Conditioner') || activeAppliances.includes('AC')) {
      recommendations.push('Inspect AC thermostat setting; increasing temperature by 2°C can reduce wastage by 12-18%.');
    }
    if (isNight) {
      recommendations.push('Check for background appliances left running unattended during night hours.');
    }
    recommendations.push('Schedule automated low-power standby mode for high-draw electronic equipment.');
  } else {
    recommendations.push('Consumption is optimal. Continue adhering to the baseline load profile.');
  }

  return {
    anomalyScore,
    severity,
    wastageProbability,
    isWastage,
    actualConsumption: c,
    expectedBaseline: exp,
    differenceKWh: Number((c - exp).toFixed(2)),
    differencePercent: ratio > 0 ? `+${pctOver}%` : `-${pctOver}%`,
    hour: hr,
    day,
    reasons,
    recommendations,
    modelName: 'Isolation Forest (Digital Pattern Classifier)',
    confidence: '94.2%'
  };
};
