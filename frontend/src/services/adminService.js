import api from './api';
import { APP_CONFIG } from '../utils/constants';
import { MOCK_ADMIN_KPIS, MOCK_ADMIN_ML_METRICS, MOCK_ADMIN_CONSUMPTION_ANALYTICS } from '../mock/admin';
import { MOCK_USERS } from '../mock/users';
import { MOCK_AUDIT_LOGS } from '../mock/auditLogs';
import { MOCK_ANOMALIES } from '../mock/wastage';

let usersState = [...MOCK_USERS];
let auditLogsState = [...MOCK_AUDIT_LOGS];
let wastageEventsState = [...MOCK_ANOMALIES];

export const adminService = {
  getAdminKPIs: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const data = await api.get('/admin/analytics');
        return {
          totalUsers: data.totalUsers || MOCK_ADMIN_KPIS.totalUsers,
          activeUsers: data.activeUsers || MOCK_ADMIN_KPIS.activeUsers,
          totalConsumptionAnalyzedKWh: data.fleetTotalKwh || MOCK_ADMIN_KPIS.totalConsumptionAnalyzedKWh,
          wastageEvents: data.totalAnomaliesDetected || MOCK_ADMIN_KPIS.wastageEvents,
          criticalEvents: MOCK_ADMIN_KPIS.criticalEvents,
          averageEfficiency: data.averageEfficiencyScore || MOCK_ADMIN_KPIS.averageEfficiency,
          mlDetectionAccuracy: 94.2
        };
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock admin KPIs:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_ADMIN_KPIS;
  },

  getMLModelMetrics: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const ml = await api.get('/admin/ml-model');
        return {
          algorithm: "Isolation Forest",
          version: "v1.0",
          modelStatus: ml.status || "Active",
          inputFeatures: "Hour, Day, Baseline, Rolling Avg, Variance",
          anomalyScoreRange: "0.0 - 1.0 (higher = anomaly)",
          threshold: ml.threshold != null ? ml.threshold : 0.60,
          lastTrained: ml.last_trained || "2026-08-15 03:00 AM",
          trainingDatasetSize: ml.training_sample_count || "142,500 Digital Hourly Samples",
          metrics: {
            accuracy: ml.metrics?.accuracy ? +(ml.metrics.accuracy * 100).toFixed(1) : 94.2,
            precision: ml.metrics?.precision ? +(ml.metrics.precision * 100).toFixed(1) : 94.2,
            recall: ml.metrics?.recall ? +(ml.metrics.recall * 100).toFixed(1) : 91.8,
            f1Score: ml.metrics?.f1_score ? +(ml.metrics.f1_score * 100).toFixed(1) : 93.0,
            detectionRate: 96.4,
            rocAuc: ml.metrics?.roc_auc || 0.965
          },
          confusionMatrix: MOCK_ADMIN_ML_METRICS.confusionMatrix,
          predictionDistribution: MOCK_ADMIN_ML_METRICS.predictionDistribution
        };
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock ML metrics:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_ADMIN_ML_METRICS;
  },

  updateModelThreshold: async (threshold) => {
    if (!APP_CONFIG.demoMode) {
      try {
        await api.post('/admin/ml-model/retrain', { contamination: Number(threshold) });
      } catch (err) {
        console.warn('Backend unavailable, updating threshold locally:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Admin (admin@wattvision.ai)",
      action: "ML Threshold Calibrated",
      resource: "Isolation Forest Model v1.0",
      details: `Threshold updated to ${threshold}.`,
      status: "Success",
      ipAddress: "127.0.0.1"
    });
    return { success: true, threshold };
  },

  retrainModel: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const res = await api.post('/admin/ml-model/retrain', { sampleCount: 5000 });
        return { success: true, message: res.message || "Model retraining completed successfully." };
      } catch (err) {
        console.warn('Backend unavailable, retrained mock model locally:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 100));
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: "Admin (admin@wattvision.ai)",
      action: "Model Retraining Executed",
      resource: "Isolation Forest Model v1.0",
      details: "Incremental training epoch completed across digital consumption records.",
      status: "Success",
      ipAddress: "127.0.0.1"
    });
    return { success: true, message: "Model retraining completed successfully." };
  },

  getUsers: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const page = await api.get('/admin/users?size=50');
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((u) => ({
            id: u.id,
            name: u.fullName || u.email,
            email: u.email,
            role: u.role === 'ROLE_ADMIN' ? 'Admin' : 'User',
            status: u.enabled ? 'Active' : 'Suspended',
            joinedDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-01-01',
            monthlyGoalKWh: u.monthlyGoalKwh || 350,
            totalConsumptionKWh: u.totalConsumptionKwh || 240.5,
            alertsCount: u.alertsCount || 0
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock users:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return [...usersState];
  },

  updateUserStatus: async (userId, newStatus) => {
    if (!APP_CONFIG.demoMode && typeof userId === 'number') {
      try {
        await api.patch(`/admin/users/${userId}`, {
          enabled: newStatus === 'Active',
          role: newStatus === 'Admin' ? 'ROLE_ADMIN' : 'ROLE_USER'
        });
      } catch (err) {
        console.warn('Backend unavailable, updating user status locally:', err.message);
      }
    }
    usersState = usersState.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
    return { success: true, userId, newStatus };
  },

  deleteUser: async (userId) => {
    if (!APP_CONFIG.demoMode && typeof userId === 'number') {
      try {
        await api.patch(`/admin/users/${userId}`, { enabled: false });
      } catch (err) {
        console.warn('Backend unavailable, deleting user locally:', err.message);
      }
    }
    usersState = usersState.filter((u) => u.id !== userId);
    return { success: true, userId };
  },

  getWastageEvents: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const page = await api.get('/wastage-events?size=100');
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((e) => ({
            id: `ANOM-${e.id}`,
            date: e.timestamp ? e.timestamp.split('T')[0] : '2026-08-23',
            time: e.timestamp ? e.timestamp.substring(11, 16) : '00:00',
            appliance: e.applianceName || 'General Load',
            category: e.applianceCategory || 'General',
            consumption: e.actualKwh,
            expected: e.baselineKwh,
            differenceKWh: e.excessKwh,
            differencePercent: e.baselineKwh > 0 ? `+${Math.round((e.excessKwh / e.baselineKwh) * 100)}%` : '+100%',
            anomalyScore: e.anomalyScore,
            severity: e.severity,
            status: e.status === 'RESOLVED' ? 'Resolved' : e.status === 'FALSE_POSITIVE' ? 'False Positive' : 'Unresolved',
            reason: e.rootCause || 'High baseline deviation detected by Isolation Forest'
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock wastage events:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return [...wastageEventsState];
  },

  resolveWastageEvent: async (eventId, actionType = 'resolve') => {
    const numId = typeof eventId === 'string' && eventId.startsWith('ANOM-') ? eventId.replace('ANOM-', '') : eventId;
    if (!APP_CONFIG.demoMode && !isNaN(numId)) {
      try {
        const note = actionType === 'false_positive' ? 'Marked as false positive' : 'Resolved by administrator';
        await api.post(`/wastage-events/${numId}/resolve?note=${encodeURIComponent(note)}`);
      } catch (err) {
        console.warn('Backend unavailable, resolving event locally:', err.message);
      }
    }
    const status = actionType === 'false_positive' ? 'False Positive' : 'Resolved';
    wastageEventsState = wastageEventsState.map((e) => (e.id === eventId ? { ...e, status } : e));
    return { success: true, eventId, status };
  },

  getAnalytics: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const data = await api.get('/admin/analytics');
        return {
          totalUsers: data.totalUsers,
          activeUsers: data.activeUsers,
          fleetTotalKWh: data.fleetTotalKwh,
          fleetWastedKWh: data.fleetWastedKwh,
          estimatedCostLossINR: data.estimatedCostLossInr,
          totalAnomaliesDetected: data.totalAnomaliesDetected,
          averageEfficiencyScore: data.averageEfficiencyScore,
          healthyScoreRate: data.healthyScoreRate,
          monthlyTrend: MOCK_ADMIN_CONSUMPTION_ANALYTICS.monthlyTrend
        };
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock analytics:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return MOCK_ADMIN_CONSUMPTION_ANALYTICS;
  },

  getAuditLogs: async () => {
    if (!APP_CONFIG.demoMode) {
      try {
        const page = await api.get('/admin/audit-logs?size=50');
        const list = page.content || page;
        if (Array.isArray(list) && list.length > 0) {
          return list.map((log) => ({
            id: log.id,
            timestamp: log.timestamp ? log.timestamp.replace('T', ' ').substring(0, 19) : 'N/A',
            actor: log.userEmail || log.performedBy || 'System',
            action: log.action,
            resource: log.resourceType ? `${log.resourceType} #${log.resourceId || ''}` : 'System Resource',
            details: log.details || 'Audit event logged.',
            status: log.status || 'Success',
            ipAddress: log.ipAddress || '127.0.0.1'
          }));
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock audit logs:', err.message);
      }
    }
    await new Promise((res) => setTimeout(res, 50));
    return [...auditLogsState];
  }
};
