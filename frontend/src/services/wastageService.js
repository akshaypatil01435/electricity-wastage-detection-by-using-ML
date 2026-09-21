import api from './api';
import { APP_CONFIG } from '../utils/constants';
import { MOCK_WASTAGE_SUMMARY, MOCK_ANOMALIES } from '../mock/wastage';
import { runMLInference } from '../utils/mlInferenceEngine';

export const wastageService = {
  getWastageSummary: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const summary = await api.get('/wastage-events/summary');
        return {
          totalWastageKWh: summary.totalWastedKwh != null ? summary.totalWastedKwh : 23.8,
          estimatedCostLoss: summary.totalFinancialLossInr != null ? summary.totalFinancialLossInr : 178.5,
          unresolvedCount: summary.unresolvedCount != null ? summary.unresolvedCount : 3,
          resolvedCount: summary.resolvedCount != null ? summary.resolvedCount : 12,
          anomalyScore: summary.detectionConfidenceAvg != null ? summary.detectionConfidenceAvg : 0.84,
          detectionStatus: "Active",
          severity: "HIGH",
          anomaliesDetectedToday: summary.unresolvedCount != null ? summary.unresolvedCount : 3,
          wastageProbability: 78
        };
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock wastage summary:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_WASTAGE_SUMMARY;
  },

  getAnomalies: async (filter = 'all') => {
    if (!APP_CONFIG.demoMode) {
      try {
        let url = '/wastage-events?size=100';
        if (filter === 'unresolved') url += '&status=DETECTED';
        if (filter === 'critical') url += '&severity=CRITICAL';

        const page = await api.get(url);
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((e) => ({
            id: `ANOM-${e.id}`,
            date: e.timestamp ? e.timestamp.split('T')[0] : '2026-08-23',
            time: e.timestamp ? e.timestamp.substring(11, 16) : '00:00',
            appliance: e.applianceName || 'General Load',
            category: e.applianceCategory || 'General',
            consumption: e.actualKwh,
            expected: e.baselineKwh,
            differenceKWh: e.excessKwh,
            differencePercent: e.baselineKwh > 0 ? `+${Math.round((e.excessKwh / e.baselineKwh) * 100)}%` : '+100%',
            anomalyScore: e.anomalyScore,
            severity: e.severity,
            status: e.status === 'RESOLVED' ? 'Resolved' : e.status === 'FALSE_POSITIVE' ? 'False Positive' : 'Unresolved',
            reason: e.rootCause || 'High baseline deviation detected by Isolation Forest',
            explanationDetails: {
              baselineDeviation: e.baselineKwh > 0 ? `+${Math.round((e.excessKwh / e.baselineKwh) * 100)}%` : '+100%',
              historicalAverage: `${(e.baselineKwh || 1.2).toFixed(2)} kWh`,
              actualUsage: `${(e.actualKwh || 2.4).toFixed(2)} kWh`,
              context: e.suggestedAction || 'Load characteristic indicates abnormal power draw.'
            }
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock anomalies:', err.message);
      }
    }

    await new Promise((res) => setTimeout(res, 50));
    if (filter === 'unresolved') {
      return MOCK_ANOMALIES.filter((a) => a.status === 'Unresolved');
    }
    if (filter === 'critical') {
      return MOCK_ANOMALIES.filter((a) => a.severity === 'CRITICAL');
    }
    return MOCK_ANOMALIES;
  },

  resolveAnomaly: async (id, resolutionNote = '') => {
    const numId = typeof id === 'string' && id.startsWith('ANOM-') ? id.replace('ANOM-', '') : id;
    if (!APP_CONFIG.demoMode && !isNaN(numId)) {
      try {
        await api.post(`/wastage-events/${numId}/resolve?note=${encodeURIComponent(resolutionNote || 'Resolved by user')}`);
        return { success: true, id, status: 'Resolved', resolutionNote };
      } catch (err) {
        console.warn('Backend unavailable, resolving anomaly locally:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return { success: true, id, status: 'Resolved', resolutionNote };
  },

  analyzeConsumption: async (payload) => {
    await new Promise((res) => setTimeout(res, 100));
    return runMLInference(payload);
  }
};
