import api from './api';
import { MOCK_ADMIN_KPIS, MOCK_ADMIN_ML_METRICS, MOCK_ADMIN_CONSUMPTION_ANALYTICS } from '../mock/admin';
import { MOCK_USERS } from '../mock/users';
import { MOCK_AUDIT_LOGS } from '../mock/auditLogs';
import { MOCK_ANOMALIES } from '../mock/wastage';

let usersState = [...MOCK_USERS];
let auditLogsState = [...MOCK_AUDIT_LOGS];
let wastageEventsState = [...MOCK_ANOMALIES];

export const adminService = {
  getAdminKPIs: async () => {
    // In production: return api.get('/admin/kpis');
    await new Promise((res) => setTimeout(res, 200));
    return MOCK_ADMIN_KPIS;
  },

  getMLModelMetrics: async () => {
    // In production: return api.get('/admin/ml-model');
    await new Promise((res) => setTimeout(res, 250));
    return MOCK_ADMIN_ML_METRICS;
  },

  updateModelThreshold: async (threshold) => {
    // In production: return api.post('/admin/ml-model/threshold', { threshold });
    await new Promise((res) => setTimeout(res, 300));
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Admin (admin@wattvision.ai)",
      action: "ML Threshold Calibrated",
      resource: "Isolation Forest Model v1.0",
      details: `Threshold updated to ${threshold}.`,
      status: "Success",
      ipAddress: "192.168.1.45"
    });
    return { success: true, threshold };
  },

  retrainModel: async () => {
    // In production: return api.post('/admin/ml-model/retrain');
    await new Promise((res) => setTimeout(res, 800));
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Admin (admin@wattvision.ai)",
      action: "Model Retraining Executed",
      resource: "Isolation Forest Model v1.0",
      details: "Incremental training epoch completed across 142,500 digital consumption records.",
      status: "Success",
      ipAddress: "192.168.1.45"
    });
    return { success: true, message: "Model retraining completed successfully." };
  },

  getUsers: async () => {
    // In production: return api.get('/admin/users');
    await new Promise((res) => setTimeout(res, 200));
    return [...usersState];
  },

  updateUserStatus: async (userId, newStatus) => {
    // In production: return api.patch(`/admin/users/${userId}/status`, { status: newStatus });
    await new Promise((res) => setTimeout(res, 250));
    usersState = usersState.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Admin (admin@wattvision.ai)",
      action: `User Status: ${newStatus}`,
      resource: `User ID: ${userId}`,
      details: `User account state transitioned to ${newStatus}.`,
      status: newStatus === 'Suspended' ? 'Warning' : 'Success',
      ipAddress: "192.168.1.45"
    });
    return { success: true, userId, newStatus };
  },

  deleteUser: async (userId) => {
    // In production: return api.delete(`/admin/users/${userId}`);
    await new Promise((res) => setTimeout(res, 300));
    usersState = usersState.filter(u => u.id !== userId);
    return { success: true, userId };
  },

  getWastageEvents: async () => {
    // In production: return api.get('/admin/wastage-events');
    await new Promise((res) => setTimeout(res, 200));
    return [...wastageEventsState];
  },

  resolveWastageEvent: async (eventId, actionType = 'resolve') => {
    // In production: return api.post(`/admin/wastage-events/${eventId}/${actionType}`);
    await new Promise((res) => setTimeout(res, 200));
    const status = actionType === 'false_positive' ? 'False Positive' : 'Resolved';
    wastageEventsState = wastageEventsState.map(e => e.id === eventId ? { ...e, status } : e);
    return { success: true, eventId, status };
  },

  getAnalytics: async () => {
    // In production: return api.get('/admin/analytics');
    await new Promise((res) => setTimeout(res, 250));
    return MOCK_ADMIN_CONSUMPTION_ANALYTICS;
  },

  getAuditLogs: async () => {
    // In production: return api.get('/admin/audit-logs');
    await new Promise((res) => setTimeout(res, 200));
    return [...auditLogsState];
  }
};
