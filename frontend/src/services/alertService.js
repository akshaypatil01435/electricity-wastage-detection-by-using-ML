import api from './api';
import { APP_CONFIG } from '../utils/constants';
import { MOCK_ALERTS } from '../mock/alerts';

let alertsState = [...MOCK_ALERTS];

export const alertService = {
  getAlerts: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const page = await api.get('/alerts?size=100');
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((a) => ({
            id: a.id,
            title: a.title,
            message: a.message,
            severity: a.severity || 'MEDIUM',
            timestamp: a.createdAt ? a.createdAt.replace('T', ' ').substring(0, 19) : 'Just now',
            read: a.read,
            category: a.alertType || 'WASTAGE',
            wastageEventId: a.wastageEventId
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock alerts:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    return [...alertsState];
  },

  getUnreadCount: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const res = await api.get('/alerts/unread-count');
        return res.unreadCount || 0;
      } catch (err) {
        console.warn('Backend unavailable, counting unread alerts locally:', err.message);
      }
    }
    return alertsState.filter((a) => !a.read).length;
  },

  markAsRead: async (id) => {
    if (!APP_CONFIG.demoMode && typeof id === 'number') {
      try {
        await api.patch(`/alerts/${id}/read`);
      } catch (err) {
        console.warn('Backend unavailable, marking alert read locally:', err.message);
      }
    }
    alertsState = alertsState.map((a) => (a.id === id ? { ...a, read: true } : a));
    return true;
  },

  markAllAsRead: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        await api.post('/alerts/mark-all-read');
      } catch (err) {
        console.warn('Backend unavailable, marking all alerts read locally:', err.message);
      }
    }
    alertsState = alertsState.map((a) => ({ ...a, read: true }));
    return true;
  },

  deleteAlert: async (id) => {
    alertsState = alertsState.filter((a) => a.id !== id);
    return true;
  }
};
