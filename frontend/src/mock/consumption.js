// 24-Hour Digital Consumption Profile (Hourly)
export const MOCK_HOURLY_CONSUMPTION = [
  { time: "00:00", actual: 0.8, expected: 0.6, difference: 0.2, anomaly: false, peak: false },
  { time: "01:00", actual: 0.7, expected: 0.5, difference: 0.2, anomaly: false, peak: false },
  { time: "02:00", actual: 0.6, expected: 0.5, difference: 0.1, anomaly: false, peak: false },
  { time: "03:00", actual: 0.6, expected: 0.5, difference: 0.1, anomaly: false, peak: false },
  { time: "04:00", actual: 0.7, expected: 0.5, difference: 0.2, anomaly: false, peak: false },
  { time: "05:00", actual: 0.9, expected: 0.7, difference: 0.2, anomaly: false, peak: false },
  { time: "06:00", actual: 1.4, expected: 1.1, difference: 0.3, anomaly: false, peak: false },
  { time: "07:00", actual: 1.9, expected: 1.5, difference: 0.4, anomaly: false, peak: false },
  { time: "08:00", actual: 2.4, expected: 1.2, difference: 1.2, anomaly: true, anomalyScore: 0.82, peak: true },
  { time: "09:00", actual: 1.8, expected: 1.4, difference: 0.4, anomaly: false, peak: false },
  { time: "10:00", actual: 1.6, expected: 1.3, difference: 0.3, anomaly: false, peak: false },
  { time: "11:00", actual: 1.7, expected: 1.4, difference: 0.3, anomaly: false, peak: false },
  { time: "12:00", actual: 2.1, expected: 1.7, difference: 0.4, anomaly: false, peak: false },
  { time: "13:00", actual: 2.3, expected: 1.6, difference: 0.7, anomaly: false, peak: false },
  { time: "14:00", actual: 3.1, expected: 1.8, difference: 1.3, anomaly: true, anomalyScore: 0.76, peak: true },
  { time: "15:00", actual: 2.0, expected: 1.5, difference: 0.5, anomaly: false, peak: false },
  { time: "16:00", actual: 1.7, expected: 1.4, difference: 0.3, anomaly: false, peak: false },
  { time: "17:00", actual: 1.8, expected: 1.5, difference: 0.3, anomaly: false, peak: false },
  { time: "18:00", actual: 2.5, expected: 2.0, difference: 0.5, anomaly: false, peak: false },
  { time: "19:00", actual: 2.8, expected: 2.2, difference: 0.6, anomaly: false, peak: false },
  { time: "20:00", actual: 2.9, expected: 2.3, difference: 0.6, anomaly: false, peak: false },
  { time: "21:00", actual: 2.6, expected: 2.0, difference: 0.6, anomaly: false, peak: false },
  { time: "22:00", actual: 2.8, expected: 1.1, difference: 1.7, anomaly: true, anomalyScore: 0.94, peak: true },
  { time: "23:00", actual: 1.4, expected: 0.8, difference: 0.6, anomaly: false, peak: false }
];

// 7-Day Digital Consumption Profile
export const MOCK_WEEKLY_CONSUMPTION = [
  { day: "Mon", actual: 18.2, expected: 16.5, wastage: 2.4, efficiency: 84 },
  { day: "Tue", actual: 19.4, expected: 16.8, wastage: 3.8, efficiency: 79 },
  { day: "Wed", actual: 17.1, expected: 16.0, wastage: 1.5, efficiency: 89 },
  { day: "Thu", actual: 21.6, expected: 16.5, wastage: 5.1, efficiency: 74 },
  { day: "Fri", actual: 19.8, expected: 17.2, wastage: 3.2, efficiency: 82 },
  { day: "Sat", actual: 24.3, expected: 20.0, wastage: 4.6, efficiency: 80 },
  { day: "Sun", actual: 22.8, expected: 19.5, wastage: 3.2, efficiency: 83 }
];

// 30-Day Monthly Digital Consumption Profile
export const MOCK_MONTHLY_CONSUMPTION = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const isWeekend = (dayNum % 7 === 6) || (dayNum % 7 === 0);
  const baseExpected = isWeekend ? 19.5 : 16.2;
  const isSpike = dayNum === 8 || dayNum === 14 || dayNum === 22 || dayNum === 27;
  const wastage = isSpike ? +(Math.random() * 3 + 2.5).toFixed(1) : +(Math.random() * 1.5 + 0.5).toFixed(1);
  const actual = +(baseExpected + (Math.random() * 2 - 1) + (isSpike ? wastage : 0)).toFixed(1);

  return {
    date: `Day ${dayNum}`,
    dayNumber: dayNum,
    actual,
    expected: baseExpected,
    wastage,
    isAnomaly: isSpike,
    cost: Math.round(actual * 7.5)
  };
});

// 12-Month Yearly Digital Consumption Profile
export const MOCK_YEARLY_CONSUMPTION = [
  { month: "Jan", actual: 380, expected: 360, wastage: 24, cost: 2850 },
  { month: "Feb", actual: 365, expected: 350, wastage: 18, cost: 2737 },
  { month: "Mar", actual: 410, expected: 390, wastage: 28, cost: 3075 },
  { month: "Apr", actual: 490, expected: 430, wastage: 62, cost: 3675 },
  { month: "May", actual: 560, expected: 480, wastage: 84, cost: 4200 },
  { month: "Jun", actual: 540, expected: 470, wastage: 75, cost: 4050 },
  { month: "Jul", actual: 480, expected: 440, wastage: 45, cost: 3600 },
  { month: "Aug", actual: 460, expected: 430, wastage: 38, cost: 3450 },
  { month: "Sep", actual: 430, expected: 410, wastage: 26, cost: 3225 },
  { month: "Oct", actual: 415, expected: 395, wastage: 22, cost: 3112 },
  { month: "Nov", actual: 390, expected: 370, wastage: 20, cost: 2925 },
  { month: "Dec", actual: 412.5, expected: 388.7, wastage: 23.8, cost: 3094 }
];

// 7 Days x 24 Hours Digital Consumption Heatmap Matrix
export const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const HOURS_LIST = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export const MOCK_HEATMAP_DATA = DAYS_OF_WEEK.map((day, dayIdx) => {
  return {
    day,
    dayIndex: dayIdx,
    hours: HOURS_LIST.map((hour, hrIdx) => {
      let baseVal = 0.5;
      if (hrIdx >= 6 && hrIdx <= 9) baseVal = 1.6;
      else if (hrIdx >= 10 && hrIdx <= 17) baseVal = 1.3;
      else if (hrIdx >= 18 && hrIdx <= 22) baseVal = 2.4;
      else baseVal = 0.6;

      // Add weekend bump
      if (dayIdx >= 5) baseVal *= 1.25;

      // Outlier spikes
      let isAnomaly = false;
      if ((dayIdx === 1 && hrIdx === 14) || (dayIdx === 3 && hrIdx === 8) || (dayIdx === 6 && hrIdx === 22)) {
        baseVal *= 2.1;
        isAnomaly = true;
      }

      const val = +(baseVal + (Math.random() * 0.3 - 0.15)).toFixed(2);
      return {
        hour,
        hourIdx: hrIdx,
        value: val,
        isAnomaly,
        intensity: Math.min(Math.round((val / 3.5) * 100), 100)
      };
    })
  };
});

// Summary KPI snapshot for user dashboard
export const MOCK_DASHBOARD_KPIS = {
  todayConsumption: {
    value: 18.7,
    unit: "kWh",
    change: "+4.2%",
    trend: "up",
    comparison: "vs. yesterday (17.9 kWh)",
    sparkline: [12, 14, 13, 16, 15, 17, 18.7]
  },
  monthConsumption: {
    value: 412.5,
    unit: "kWh",
    change: "-2.8%",
    trend: "down",
    comparison: "vs. last month (424.1 kWh)",
    sparkline: [380, 395, 410, 430, 420, 415, 412.5]
  },
  wastageDetected: {
    value: 23.8,
    unit: "kWh",
    change: "+12.5%",
    trend: "up",
    comparison: "Potential ₹178.50 wasted",
    severity: "HIGH",
    sparkline: [15, 18, 14, 22, 19, 21, 23.8]
  },
  estimatedCost: {
    value: 3284,
    unit: "₹",
    change: "+3.1%",
    trend: "up",
    comparison: "Tariff: ₹7.50 / kWh",
    sparkline: [2900, 3050, 3120, 3200, 3180, 3240, 3284]
  },
  efficiencyScore: {
    value: 82,
    unit: "%",
    change: "+5.0%",
    trend: "up",
    comparison: "Good (Target: >85%)",
    status: "Good"
  },
  activeAlerts: {
    value: 4,
    unit: "Alerts",
    change: "+1 new",
    trend: "neutral",
    criticalCount: 1,
    warningCount: 3
  }
};
