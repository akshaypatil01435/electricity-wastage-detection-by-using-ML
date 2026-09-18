import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { exportToCSV } from '../../utils/exportUtils';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleExportCSV = () => {
    exportToCSV(logs, 'wattvision_audit_logs.csv');
  };

  const columns = [
    {
      header: "Timestamp",
      key: "timestamp",
      sortable: true,
      render: (val) => <span className="font-mono text-slate-400 text-[11px]">{val}</span>
    },
    {
      header: "Actor",
      key: "actor",
      sortable: true,
      render: (val) => <span className="font-bold text-white text-xs">{val}</span>
    },
    {
      header: "Action Performed",
      key: "action",
      sortable: true,
      render: (val) => <span className="font-semibold text-emerald-400 text-xs">{val}</span>
    },
    {
      header: "Target Resource",
      key: "resource",
      render: (val) => <span className="text-slate-300 text-xs">{val}</span>
    },
    {
      header: "Status",
      key: "status",
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val === 'Success'
            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            : 'bg-amber-950 text-amber-300 border border-amber-800'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Details",
      key: "details",
      render: (val) => <span className="text-slate-400 text-[11px] truncate max-w-xs block">{val}</span>
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="SYSTEM AUDITABILITY & SECURITY"
        title="Audit Logs"
        subtitle="Immutable security trail recording administrative configurations, model recalibrations, user state changes, and batch executions."
        actions={
          <Button size="sm" variant="primary" icon={FileSpreadsheet} onClick={handleExportCSV}>
            Export Audit CSV
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        searchKey="action"
        searchPlaceholder="Search audit actions or actors..."
      />
    </div>
  );
};

export default AdminAuditLogs;
