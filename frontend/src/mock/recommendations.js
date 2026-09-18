export const MOCK_RECOMMENDATIONS = [
  {
    id: "rec_01",
    priority: "HIGH",
    title: "Overnight Load Surge Mitigation",
    reason: "Your digital electricity consumption between 11 PM and 2 AM is unusually high (+155% vs baseline).",
    recommendation: "Review appliances left running overnight. Enabling automated sleep timers on the master AC can eliminate unmonitored cooling cycles.",
    estimatedMonthlySavingsKWh: 18.5,
    estimatedMonthlySavingsINR: 138.75,
    impact: "High",
    category: "Cooling & Night Load",
    status: "Active",
    actionLabel: "Set AC Schedule Guideline"
  },
  {
    id: "rec_02",
    priority: "HIGH",
    title: "Air Conditioner Thermostat Optimization",
    reason: "Air conditioner consumption is approximately 32% above your normal seasonal pattern.",
    recommendation: "Adjust thermostat baseline from 20°C to 24°C. Each 1°C increase reduces compressor power draw by approximately 6%.",
    estimatedMonthlySavingsKWh: 24.0,
    estimatedMonthlySavingsINR: 180.00,
    impact: "High",
    category: "HVAC",
    status: "Active",
    actionLabel: "Apply 24°C Benchmark"
  },
  {
    id: "rec_03",
    priority: "MEDIUM",
    title: "Water Heater (Geyser) Timer Optimization",
    reason: "Water heater operates for >90 continuous minutes during peak morning tariff intervals.",
    recommendation: "Cap pre-heating duration to 25 minutes prior to usage. Continuous thermostat cycling causes standby heat loss.",
    estimatedMonthlySavingsKWh: 12.0,
    estimatedMonthlySavingsINR: 90.00,
    impact: "Medium",
    category: "Water Heating",
    status: "Active",
    actionLabel: "Limit Heat Cycle"
  },
  {
    id: "rec_04",
    priority: "MEDIUM",
    title: "Workstation Standby Power Elimination",
    reason: "Computer workstations consume 0.45 kWh consistently during idle non-working weekend hours.",
    recommendation: "Activate smart power strip or hibernate workstation peripherals when absent for more than 45 minutes.",
    estimatedMonthlySavingsKWh: 8.5,
    estimatedMonthlySavingsINR: 63.75,
    impact: "Medium",
    category: "Electronics",
    status: "Active",
    actionLabel: "Enable Power Savings"
  },
  {
    id: "rec_05",
    priority: "LOW",
    title: "LED Lighting Transition for Ancillary Areas",
    reason: "Minor incandescent/halogen baseline signature detected in utility and balcony zones.",
    recommendation: "Upgrade remaining non-LED lamps to 9W high-efficiency LED units.",
    estimatedMonthlySavingsKWh: 4.2,
    estimatedMonthlySavingsINR: 31.50,
    impact: "Low",
    category: "Lighting",
    status: "Completed",
    actionLabel: "Mark Upgraded"
  }
];
