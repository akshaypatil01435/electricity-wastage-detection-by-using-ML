import api from './api';
import { MOCK_REPORTS } from '../mock/reports';

export const reportService = {
  getReports: async () => {
    // In production: return api.get('/reports');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_REPORTS;
  },

  generateReport: async (reportType) => {
    // In production: return api.post('/reports/generate', { type: reportType });
    await new Promise((res) => setTimeout(res, 600));
    const newReport = {
      id: `rep_${Date.now()}`,
      type: reportType,
      title: `${reportType} Generated On Demand`,
      date: new Date().toISOString().split('T')[0],
      period: "Current Cycle",
      totalConsumption: 412.5,
      expectedConsumption: 388.7,
      detectedWastage: 23.8,
      estimatedCost: 3093.75,
      efficiencyScore: 82,
      peakConsumption: "3.1 kWh at 14:00",
      anomalyCount: 4,
      status: "Generated",
      summaryText: "Automated digital consumption audit completed with current real-time metrics."
    };
    return newReport;
  }
};
