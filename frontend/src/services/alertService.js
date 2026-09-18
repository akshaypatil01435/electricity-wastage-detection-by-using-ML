import api from './api';
import { MOCK_ALERTS } from '../mock/alerts';

let alertsState = [...MOCK_ALERTS];

export const alertService = {
  getAlerts: async () => {
    // In production: return api.get('/alerts');
    await new Promise((res) => setTimeout(res, 200));
    return [...alertsState];
  },

  markAsRead: async (id) => {
    // In production: return api.patch(`/alerts/${id}/read`);
    alertsState = alertsState.map(a => a.id === id ? { ...a, read: true } : a);
    return true;
  },

  markAllAsRead: async () => {
    // In production: return api.post('/alerts/mark-all-read');
    alertsState = alertsState.map(a => ({ ...a, read: true }));
    return true;
  },

  deleteAlert: async (id) => {
    // In production: return api.delete(`/alerts/${id}`);
    alertsState = alertsState.filter(a => a.id !== id);
    return true;
  }
};
