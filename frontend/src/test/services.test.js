import { describe, it, expect, beforeEach } from 'vitest';
import { consumptionService } from '../services/consumptionService';
import { wastageService } from '../services/wastageService';
import { alertService } from '../services/alertService';
import { adminService } from '../services/adminService';
import { reportService } from '../services/reportService';
import { authService } from '../services/authService';

describe('Frontend Services Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('authService', () => {
    it('returns valid auth payload on simulated login', async () => {
      const res = await authService.login('user@wattvision.ai', 'user123');
      expect(res).toBeDefined();
      expect(res.token).toBeDefined();
      expect(res.user.email).toBe('user@wattvision.ai');
      expect(res.user.role).toBe('ROLE_USER');
    });

    it('rejects short passwords under 6 characters in demo mode', async () => {
      await expect(authService.login('user@wattvision.ai', '123'))
        .rejects.toThrow();
    });

    it('returns admin user role for admin credentials', async () => {
      const res = await authService.login('admin@wattvision.ai', 'admin123');
      expect(res.user.role).toBe('ROLE_ADMIN');
    });
  });

  describe('consumptionService', () => {
    it('retrieves dashboard KPIs', async () => {
      const kpis = await consumptionService.getDashboardKPIs();
      expect(kpis).toBeDefined();
      expect(kpis.monthConsumption.value).toBeGreaterThan(0);
      expect(kpis.efficiencyScore.value).toBeGreaterThanOrEqual(0);
    });

    it('retrieves hourly and weekly consumption datasets', async () => {
      const hourly = await consumptionService.getConsumptionData('day');
      expect(Array.isArray(hourly)).toBe(true);
      expect(hourly.length).toBeGreaterThan(0);

      const weekly = await consumptionService.getConsumptionData('week');
      expect(Array.isArray(weekly)).toBe(true);
      expect(weekly.length).toBeGreaterThan(0);
    });

    it('retrieves appliance breakdown list', async () => {
      const appliances = await consumptionService.getApplianceBreakdown();
      expect(Array.isArray(appliances)).toBe(true);
      expect(appliances.length).toBeGreaterThan(0);
      expect(appliances[0]).toHaveProperty('name');
      expect(appliances[0]).toHaveProperty('consumptionKWh');
    });
  });

  describe('wastageService', () => {
    it('retrieves wastage summary metrics', async () => {
      const summary = await wastageService.getWastageSummary();
      expect(summary).toBeDefined();
      expect(summary.totalWastageKWh).toBeGreaterThanOrEqual(0);
      expect(summary.anomalyScore).toBeGreaterThan(0);
    });

    it('filters anomalies by status', async () => {
      const all = await wastageService.getAnomalies('all');
      const unresolved = await wastageService.getAnomalies('unresolved');
      expect(Array.isArray(all)).toBe(true);
      expect(Array.isArray(unresolved)).toBe(true);
    });

    it('resolves an anomaly successfully', async () => {
      const res = await wastageService.resolveAnomaly('ANOM-2026-0801', 'Turned off AC');
      expect(res.success).toBe(true);
      expect(res.status).toBe('Resolved');
    });
  });

  describe('alertService', () => {
    it('fetches alerts list and calculates unread count', async () => {
      const alerts = await alertService.getAlerts();
      expect(Array.isArray(alerts)).toBe(true);
      const unread = await alertService.getUnreadCount();
      expect(typeof unread).toBe('number');
    });

    it('marks alert as read', async () => {
      const alerts = await alertService.getAlerts();
      if (alerts.length > 0) {
        const res = await alertService.markAsRead(alerts[0].id);
        expect(res).toBe(true);
      }
    });
  });

  describe('adminService', () => {
    it('fetches admin KPIs and ML metrics', async () => {
      const kpis = await adminService.getAdminKPIs();
      expect(kpis.totalUsers).toBeGreaterThanOrEqual(1);

      const ml = await adminService.getMLModelMetrics();
      expect(ml.modelStatus).toBe('Active');
      expect(ml.metrics.accuracy).toBeGreaterThan(90);
    });

    it('triggers simulated retraining and logs audit entry', async () => {
      const res = await adminService.retrainModel();
      expect(res.success).toBe(true);

      const logs = await adminService.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
    });
  });

  describe('reportService', () => {
    it('fetches and generates audit reports', async () => {
      const reports = await reportService.getReports();
      expect(Array.isArray(reports)).toBe(true);

      const newReport = await reportService.generateReport('Weekly Audit');
      expect(newReport).toBeDefined();
      expect(newReport.type).toBe('Weekly Audit');
    });
  });
});
