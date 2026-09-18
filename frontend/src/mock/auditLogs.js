export const MOCK_AUDIT_LOGS = [
  {
    id: "aud_01",
    timestamp: "2026-08-23 10:45:12",
    actor: "Admin (admin@wattguard.io)",
    action: "ML Threshold Calibrated",
    resource: "Isolation Forest Model v1.0",
    details: "Threshold adjusted from 0.65 to 0.60 for heightened anomaly detection sensitivity.",
    status: "Success",
    ipAddress: "192.168.1.45"
  },
  {
    id: "aud_02",
    timestamp: "2026-08-23 09:12:00",
    actor: "System Scheduler",
    action: "Daily Digital Audit Batch",
    resource: "Digital Ingestion Pipeline",
    details: "Processed 1,248 user consumption streams. 34 anomalies flagged.",
    status: "Success",
    ipAddress: "127.0.0.1"
  },
  {
    id: "aud_03",
    timestamp: "2026-08-22 16:30:22",
    actor: "Admin (admin@wattguard.io)",
    action: "User Account Suspended",
    resource: "User ID: usr_004 (arjun.v@techcorp.io)",
    details: "Suspended due to repeated high abnormal traffic test cycles.",
    status: "Warning",
    ipAddress: "192.168.1.45"
  },
  {
    id: "aud_04",
    timestamp: "2026-08-22 14:05:10",
    actor: "User (demo@wattguard.io)",
    action: "Appliance Profile Updated",
    resource: "Appliance ID: app_01 (Air Conditioner)",
    details: "Updated rated power from 1400W to 1500W.",
    status: "Success",
    ipAddress: "103.21.14.88"
  },
  {
    id: "aud_05",
    timestamp: "2026-08-21 11:20:00",
    actor: "Admin (admin@wattguard.io)",
    action: "Report Exported (PDF)",
    resource: "Monthly Energy Audit July 2026",
    details: "Downloaded executive summary PDF for board review.",
    status: "Success",
    ipAddress: "192.168.1.45"
  },
  {
    id: "aud_06",
    timestamp: "2026-08-20 04:00:15",
    actor: "ML Pipeline Engine",
    action: "Model Retraining Scheduled",
    resource: "Isolation Forest Weights",
    details: "Incremental training epoch completed with 142,500 digital samples. F1-Score: 93.0%.",
    status: "Success",
    ipAddress: "127.0.0.1"
  }
];
