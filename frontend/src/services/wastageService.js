import api from './api';
import { MOCK_WASTAGE_SUMMARY, MOCK_ANOMALIES } from '../mock/wastage';
import { runMLInference } from '../utils/mlInferenceEngine';

export const wastageService = {
  getWastageSummary: async () => {
    // In production: return api.get('/wastage/summary');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_WASTAGE_SUMMARY;
  },

  getAnomalies: async (filter = 'all') => {
    // In production: return api.get(`/wastage/events?status=${filter}`);
    await new Promise((res) => setTimeout(res, 250));
    if (filter === 'unresolved') {
      return MOCK_ANOMALIES.filter(a => a.status === 'Unresolved');
    }
    if (filter === 'critical') {
      return MOCK_ANOMALIES.filter(a => a.severity === 'CRITICAL');
    }
    return MOCK_ANOMALIES;
  },

  resolveAnomaly: async (id, resolutionNote = '') => {
    // In production: return api.post(`/wastage/events/${id}/resolve`, { resolutionNote });
    await new Promise((res) => setTimeout(res, 300));
    return { success: true, id, status: 'Resolved', resolutionNote };
  },

  analyzeConsumption: async (payload) => {
    // In production: return api.post('/wastage/analyze', payload);
    await new Promise((res) => setTimeout(res, 450)); // Simulating ML inference compute
    return runMLInference(payload);
  }
};
