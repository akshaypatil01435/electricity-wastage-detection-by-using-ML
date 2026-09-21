import api from './api';
import { APP_CONFIG } from '../utils/constants';
import { MOCK_REPORTS } from '../mock/reports';

export const reportService = {
  getReports: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const page = await api.get('/reports?size=50');
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((r) => ({
            id: r.id,
            type: r.reportType || 'Custom Audit',
            title: r.title,
            date: r.generatedAt ? r.generatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            period: r.period || 'Digital Audit Cycle',
            totalConsumption: r.totalKwh,
            expectedConsumption: +(r.totalKwh - r.wastedKwh).toFixed(1),
            detectedWastage: r.wastedKwh,
            estimatedCost: r.totalCostInr,
            efficiencyScore: r.efficiencyScore,
            peakConsumption: r.peakPeriod || '2.8 kWh (Simulated Peak)',
            anomalyCount: r.anomalyCount,
            status: r.status || 'Generated',
            summaryText: r.summaryText || 'Digital consumption audit report generated automatically.'
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock reports:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    return MOCK_REPORTS;
  },

  generateReport: async (reportType) => {
    if (!APP_CONFIG.demoMode) {
      try {
        const now = new Date();
        const past = new Date();
        past.setDate(past.getDate() - 30);

        const res = await api.post('/reports/generate', {
          reportType: reportType === 'Weekly Audit' ? 'WEEKLY_AUDIT' : 'MONTHLY_SUMMARY',
          startDate: past.toISOString(),
          endDate: now.toISOString()
        });

        return {
          id: res.id,
          type: res.reportType,
          title: res.title,
          date: res.generatedAt ? res.generatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          period: res.period,
          totalConsumption: res.totalKwh,
          expectedConsumption: +(res.totalKwh - res.wastedKwh).toFixed(1),
          detectedWastage: res.wastedKwh,
          estimatedCost: res.totalCostInr,
          efficiencyScore: res.efficiencyScore,
          peakConsumption: res.peakPeriod || 'N/A',
          anomalyCount: res.anomalyCount,
          status: res.status,
          summaryText: res.summaryText
        };
      } catch (err) {
        console.warn('Backend unavailable, generating mock report locally:', err.message);
      }
    }

    await new Promise((res) => setTimeout(res, 300));
    const newReport = {
      id: `rep_${Date.now()}`,
      type: reportType,
      title: `${reportType} Generated On Demand`,
      date: new Date().toISOString().split('T')[0],
      period: 'Current Cycle',
      totalConsumption: 412.5,
      expectedConsumption: 388.7,
      detectedWastage: 23.8,
      estimatedCost: 3093.75,
      efficiencyScore: 82,
      peakConsumption: '3.1 kWh at 14:00',
      anomalyCount: 4,
      status: 'Generated',
      summaryText: 'Automated digital consumption audit completed with current real-time metrics.'
    };
    return newReport;
  },

  exportCsv: async (id) => {
    if (!APP_CONFIG.demoMode && typeof id === 'number') {
      try {
        return await api.get(`/reports/${id}/export-csv`);
      } catch (err) {
        console.warn('Backend unavailable, exporting simulated CSV:', err.message);
      }
    }
    return `Timestamp,Total_kWh,Wasted_kWh,Status\n${new Date().toISOString()},412.5,23.8,GENERATED\n`;
  }
};
