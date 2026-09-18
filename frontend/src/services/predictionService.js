import api from './api';
import { MOCK_24H_PREDICTIONS, MOCK_7D_PREDICTIONS, MOCK_30D_PREDICTIONS } from '../mock/predictions';

export const predictionService = {
  getPredictions: async (horizon = '24h') => {
    // In production: return api.get(`/predictions?horizon=${horizon}`);
    await new Promise((res) => setTimeout(res, 250));
    switch (horizon) {
      case '7d':
        return { data: MOCK_7D_PREDICTIONS, summary: MOCK_30D_PREDICTIONS };
      case '30d':
        return { data: MOCK_7D_PREDICTIONS, summary: MOCK_30D_PREDICTIONS };
      case '24h':
      default:
        return { data: MOCK_24H_PREDICTIONS, summary: MOCK_30D_PREDICTIONS };
    }
  }
};
