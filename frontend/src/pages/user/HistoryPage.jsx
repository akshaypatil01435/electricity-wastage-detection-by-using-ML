import React, { useState, useEffect } from 'react';
import {
  History,
  Download,
  Printer,
  Filter,
  FileSpreadsheet,
  Calendar,
  Search
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { wastageService } from '../../services/wastageService';
import { exportToCSV, triggerPrintReport } from '../../utils/exportUtils';
import { formatKWh } from '../../utils/formatters';

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const list = await wastageService.getAnomalies('all');
        setHistoryData(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleExportCSV = () => {
    const exportable = historyData.map(item => ({
      ID: item.id,
      Date: item.date,
      Time: item.time,
      ActualKWh: item.consumption,
      ExpectedKWh: item.expected,
      DifferenceKWh: item.differenceKWh,
      AnomalyScore: item.anomalyScore,
      Severity: item.severity,
      Status: item.status,
      Appliance: item.appliance
    }));
    exportToCSV(exportable, 'wattvision_history_records.csv');
  };

  const filtered = historyData.filter(item => {
    if (severityFilter === 'ALL') return true;
    return item.severity === severityFilter;
  });

  const columns = [
    {
      header: "Date & Time",
      key: "time",
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{row.time}</span>
          <span className="text-[10px] text-slate-400">{row.date}</span>
        </div>
      )
    },
    {
      header: "Actual Usage",
      key: "consumption",
      sortable: true,
      render: (val) => <span className="font-bold text-forest-800 dark:text-emerald-400">{formatKWh(val)}</span>
    },
    {
      header: "Baseline Expected",
      key: "expected",
      sortable: true,
      render: (val) => <span className="text-slate-500">{formatKWh(val)}</span>
    },
    {
      header: "Wastage Excess",
      key: "differenceKWh",
      sortable: true,
      render: (val, row) => (
        <span className="font-bold text-rose-600 dark:text-rose-400">
          +{val} kWh ({row.differencePercent})
        </span>
      )
    },
    {
      header: "Anomaly Score",
      key: "anomalyScore",
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{val ? val.toFixed(2) : "0.80"}</span>
    },
    {
      header: "Severity",
      key: "severity",
      sortable: true,
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (val) => (
        <span className={`text-xs font-semibold ${val === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="HISTORICAL AUDIT ARCHIVE"
        title="Consumption & Anomaly History"
        subtitle="Complete chronological log of historical digital consumption intervals, deviation scores, and resolved incidents."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" icon={Printer} onClick={triggerPrintReport}>
              Print Report
            </Button>
            <Button size="sm" variant="primary" icon={FileSpreadsheet} onClick={handleExportCSV}>
              Export CSV
            </Button>
          </div>
        }
      />

      {/* Severity Filter Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Filter Severity:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              severityFilter === sev
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* History Data Table */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKey="appliance"
        searchPlaceholder="Search by appliance profile..."
      />
    </div>
  );
};

export default HistoryPage;
