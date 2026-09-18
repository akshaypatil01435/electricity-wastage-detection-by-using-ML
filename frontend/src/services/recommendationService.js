import api from './api';
import { MOCK_RECOMMENDATIONS } from '../mock/recommendations';

export const recommendationService = {
  getRecommendations: async () => {
    // In production: return api.get('/recommendations');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_RECOMMENDATIONS;
  },

  updateStatus: async (id, status) => {
    // In production: return api.patch(`/recommendations/${id}`, { status });
    await new Promise((res) => setTimeout(res, 200));
    return { id, status };
  }
};
