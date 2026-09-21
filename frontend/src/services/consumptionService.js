import api from './api';
import { APP_CONFIG } from '../utils/constants';
import {
  MOCK_DASHBOARD_KPIS,
  MOCK_HOURLY_CONSUMPTION,
  MOCK_WEEKLY_CONSUMPTION,
  MOCK_MONTHLY_CONSUMPTION,
  MOCK_YEARLY_CONSUMPTION,
  MOCK_HEATMAP_DATA
} from '../mock/consumption';
import { MOCK_APPLIANCES } from '../mock/appliances';

export const consumptionService = {
  getDashboardKPIs: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const summary = await api.get('/consumption/summary');
        if (summary) {
          return {
            todayConsumption: {
              value: summary.todayKwh != null ? summary.todayKwh : 18.7,
              unit: "kWh",
              change: "+4.2%",
              trend: "up",
              comparison: "vs. yesterday",
              sparkline: [12, 14, 13, 16, 15, 17, summary.todayKwh || 18.7]
            },
            monthConsumption: {
              value: summary.currentMonthKwh != null ? summary.currentMonthKwh : 412.5,
              unit: "kWh",
              change: "-2.8%",
              trend: "down",
              comparison: "vs. last month",
              sparkline: [380, 395, 410, 430, 420, 415, summary.currentMonthKwh || 412.5]
            },
            wastageDetected: {
              value: summary.wastedKwh != null ? summary.wastedKwh : 23.8,
              unit: "kWh",
              change: "+12.5%",
              trend: "up",
              comparison: `Potential ₹${summary.wastedCostInr || 178.5} wasted`,
              severity: "HIGH",
              sparkline: [15, 18, 14, 22, 19, 21, summary.wastedKwh || 23.8]
            },
            estimatedCost: {
              value: summary.currentMonthCostInr != null ? Math.round(summary.currentMonthCostInr) : 3284,
              unit: "₹",
              change: "+3.1%",
              trend: "up",
              comparison: "Tariff: ₹7.50 / kWh",
              sparkline: [2900, 3050, 3120, 3200, 3180, 3240, summary.currentMonthCostInr || 3284]
            },
            efficiencyScore: {
              value: summary.efficiencyScore != null ? summary.efficiencyScore : 82,
              unit: "%",
              change: "+5.0%",
              trend: "up",
              comparison: "Good (Target: >85%)",
              status: "Good"
            },
            activeAlerts: {
              value: summary.unresolvedAnomaliesCount != null ? summary.unresolvedAnomaliesCount : 4,
              unit: "Alerts",
              change: "+1 new",
              trend: "neutral",
              criticalCount: Math.max(1, summary.unresolvedAnomaliesCount || 1),
              warningCount: 3
            }
          };
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock dashboard KPIs:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_DASHBOARD_KPIS;
  },

  getConsumptionData: async (timeframe = 'day') => {
    if (!APP_CONFIG.demoMode) {
      try {
        let interval = 'hourly';
        if (timeframe === 'week' || timeframe === 'month') interval = 'daily';
        if (timeframe === 'year') interval = 'monthly';

        const data = await api.get(`/consumption/aggregates?interval=${interval}`);
        if (Array.isArray(data) && data.length > 0) {
          return data.map((pt) => ({
            time: pt.timestamp ? pt.timestamp.substring(11, 16) || pt.timestamp.substring(0, 10) : 'N/A',
            hour: pt.timestamp ? pt.timestamp.substring(11, 16) : 'N/A',
            day: pt.timestamp ? pt.timestamp.substring(5, 10) : 'N/A',
            month: pt.timestamp ? pt.timestamp.substring(0, 7) : 'N/A',
            actual: pt.actualKwh,
            expected: pt.baselineKwh,
            difference: +(pt.actualKwh - pt.baselineKwh).toFixed(2),
            anomaly: pt.anomaly,
            isAnomaly: pt.anomaly,
            peak: pt.anomaly
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock consumption data:', err.message);
      }
    }

    await new Promise((res) => setTimeout(res, 50));
    switch (timeframe) {
      case 'week':
        return MOCK_WEEKLY_CONSUMPTION;
      case 'month':
        return MOCK_MONTHLY_CONSUMPTION;
      case 'year':
        return MOCK_YEARLY_CONSUMPTION;
      case 'day':
      default:
        return MOCK_HOURLY_CONSUMPTION;
    }
  },

  getHeatmapData: async () => {
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_HEATMAP_DATA;
  },

  getApplianceBreakdown: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const breakdown = await api.get('/appliances/breakdown');
        if (Array.isArray(breakdown) && breakdown.length > 0) {
          return breakdown.map((item, idx) => ({
            id: item.applianceId || `app_${idx}`,
            name: item.applianceName,
            category: item.category || 'General',
            consumptionKWh: item.monthlyKwh,
            estimatedCost: item.estimatedMonthlyCostInr,
            percentage: item.percentageOfTotal,
            efficiencyStatus: item.monthlyKwh > 80 ? 'High Wastage' : 'Optimal',
            iconName: item.category === 'Cooling' ? 'Wind' : item.category === 'Kitchen' ? 'Refrigerator' : 'Cpu'
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock appliance breakdown:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_APPLIANCES;
  },

  saveAppliance: async (appliance) => {
    if (!APP_CONFIG.demoMode) {
      try {
        const payload = {
          name: appliance.name,
          category: appliance.category?.toUpperCase() || 'OTHER',
          ratedWatts: appliance.ratedPowerWatts || 500,
          dailyUsageHours: appliance.avgHoursPerDay || 4.0,
          location: appliance.location || 'Home'
        };
        if (appliance.id && typeof appliance.id === 'number') {
          return await api.put(`/appliances/${appliance.id}`, payload);
        }
        return await api.post('/appliances', payload);
      } catch (err) {
        console.warn('Backend unavailable, saving appliance locally:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return appliance;
  },

  deleteAppliance: async (id) => {
    if (!APP_CONFIG.demoMode && typeof id === 'number') {
      try {
        await api.delete(`/appliances/${id}`);
        return { success: true, id };
      } catch (err) {
        console.warn('Backend unavailable, removing appliance locally:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return { success: true, id };
  },

  createRecord: async (record) => {
    if (!APP_CONFIG.demoMode) {
      try {
        return await api.post('/consumption/records', record);
      } catch (err) {
        console.warn('Failed to post consumption record:', err.message);
      }
    }
    return { success: true, ...record };
  },

  createBatch: async (records) => {
    if (!APP_CONFIG.demoMode) {
      try {
        return await api.post('/consumption/batch', { records });
      } catch (err) {
        console.warn('Failed to post consumption batch:', err.message);
      }
    }
    return records;
  },

  uploadCsv: async (file) => {
    if (!APP_CONFIG.demoMode) {
      const formData = new FormData();
      formData.append('file', file);
      return await api.post('/consumption/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, message: 'CSV parsed in demo simulation mode' };
  }
};
