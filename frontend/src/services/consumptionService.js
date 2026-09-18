import api from './api';
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
    // In production: return api.get('/consumption/summary');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_DASHBOARD_KPIS;
  },

  getConsumptionData: async (timeframe = 'day') => {
    // In production: return api.get(`/consumption?timeframe=${timeframe}`);
    await new Promise((res) => setTimeout(res, 250));
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
    // In production: return api.get('/consumption/heatmap');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_HEATMAP_DATA;
  },

  getApplianceBreakdown: async () => {
    // In production: return api.get('/appliances');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_APPLIANCES;
  },

  saveAppliance: async (appliance) => {
    // In production: return api.post('/appliances', appliance);
    await new Promise((res) => setTimeout(res, 300));
    return appliance;
  },

  deleteAppliance: async (id) => {
    // In production: return api.delete(`/appliances/${id}`);
    await new Promise((res) => setTimeout(res, 200));
    return { success: true, id };
  }
};
