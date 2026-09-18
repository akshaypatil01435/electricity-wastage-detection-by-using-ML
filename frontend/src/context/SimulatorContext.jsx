import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { runMLInference } from '../utils/mlInferenceEngine';

const SimulatorContext = createContext(null);

export const SimulatorProvider = ({ children }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 5x, 10x
  const [simulatedHour, setSimulatedHour] = useState(14);
  const [activeAnomalyScenario, setActiveAnomalyScenario] = useState(null);

  const [currentReading, setCurrentReading] = useState({
    consumption: 2.84,
    expectedBaseline: 1.40,
    timestamp: new Date().toLocaleTimeString(),
    anomalyScore: 0.78,
    severity: "HIGH",
    isWastage: true,
    activeProfile: "Simulated Digital Stream",
    pipelineStep: "alert"
  });

  const [streamHistory, setStreamHistory] = useState([
    { time: "13:50", consumption: 1.6, expected: 1.4, isAnomaly: false },
    { time: "13:52", consumption: 1.7, expected: 1.4, isAnomaly: false },
    { time: "13:54", consumption: 1.8, expected: 1.4, isAnomaly: false },
    { time: "13:56", consumption: 2.2, expected: 1.4, isAnomaly: false },
    { time: "13:58", consumption: 2.84, expected: 1.4, isAnomaly: true }
  ]);

  const [anomaliesCount, setAnomaliesCount] = useState(3);
  const timerRef = useRef(null);

  // Simulation tick loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = Math.max(1000 / speed, 300);

    timerRef.current = setInterval(() => {
      setSimulatedHour((prevHr) => (prevHr + 1) % 24);

      // Baseline according to simulated hour
      let baseline = 0.8;
      if (simulatedHour >= 6 && simulatedHour <= 9) baseline = 1.6;
      else if (simulatedHour >= 10 && simulatedHour <= 17) baseline = 1.5;
      else if (simulatedHour >= 18 && simulatedHour <= 22) baseline = 2.2;

      let consumptionVal = +(baseline + (Math.random() * 0.4 - 0.2)).toFixed(2);
      let appliances = ['Lighting', 'Fans'];

      if (activeAnomalyScenario === 'night_ac_spike') {
        consumptionVal = +(baseline + 2.1 + Math.random() * 0.5).toFixed(2);
        appliances = ['Air Conditioner (Continuous)', 'Compressor Surge'];
      } else if (activeAnomalyScenario === 'geyser_overrun') {
        consumptionVal = +(baseline + 1.8 + Math.random() * 0.4).toFixed(2);
        appliances = ['Water Heater (Overrun >90m)'];
      } else if (activeAnomalyScenario === 'idle_leak') {
        consumptionVal = +(baseline + 1.2 + Math.random() * 0.3).toFixed(2);
        appliances = ['Workstation Cluster', 'High Standby Load'];
      } else if (Math.random() < 0.15) {
        // Random natural anomaly
        consumptionVal = +(baseline + 1.4).toFixed(2);
        appliances = ['Air Conditioner'];
      }

      // Run ML inference
      const mlResult = runMLInference({
        hour: simulatedHour,
        day: 'Simulated Day',
        consumption: consumptionVal,
        previousConsumption: currentReading.consumption,
        expectedBaseline: baseline,
        activeAppliances: appliances,
        duration: 90
      });

      const newReading = {
        consumption: consumptionVal,
        expectedBaseline: baseline,
        timestamp: `${simulatedHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        anomalyScore: mlResult.anomalyScore,
        severity: mlResult.severity,
        isWastage: mlResult.isWastage,
        activeProfile: appliances.join(', '),
        reasons: mlResult.reasons,
        differenceKWh: mlResult.differenceKWh,
        pipelineStep: mlResult.isWastage ? 'alert' : 'ml'
      };

      setCurrentReading(newReading);

      if (mlResult.isWastage) {
        setAnomaliesCount((prev) => prev + 1);
      }

      setStreamHistory((prev) => {
        const next = [...prev.slice(-15), {
          time: newReading.timestamp,
          consumption: newReading.consumption,
          expected: newReading.expectedBaseline,
          isAnomaly: mlResult.isWastage
        }];
        return next;
      });

      // Clear scenario after tick
      if (activeAnomalyScenario) {
        setActiveAnomalyScenario(null);
      }
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [isRunning, speed, simulatedHour, activeAnomalyScenario, currentReading.consumption]);

  const startSimulation = () => setIsRunning(true);
  const pauseSimulation = () => setIsRunning(false);
  const resetSimulation = () => {
    setIsRunning(false);
    setSimulatedHour(12);
    setAnomaliesCount(0);
    setStreamHistory([]);
    setCurrentReading({
      consumption: 1.4,
      expectedBaseline: 1.4,
      timestamp: "12:00",
      anomalyScore: 0.2,
      severity: "LOW",
      isWastage: false,
      activeProfile: "Baseline Digital Stream",
      pipelineStep: "data"
    });
  };

  const triggerAnomaly = (scenarioType) => {
    setActiveAnomalyScenario(scenarioType);
    if (!isRunning) setIsRunning(true);
  };

  return (
    <SimulatorContext.Provider
      value={{
        isRunning,
        speed,
        setSpeed,
        simulatedHour,
        currentReading,
        streamHistory,
        anomaliesCount,
        startSimulation,
        pauseSimulation,
        resetSimulation,
        triggerAnomaly
      }}
    >
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulator must be used within a SimulatorProvider');
  }
  return context;
};
