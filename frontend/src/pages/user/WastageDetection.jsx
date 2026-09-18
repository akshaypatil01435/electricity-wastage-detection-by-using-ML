import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  BrainCircuit,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Filter,
  Eye,
  Sliders
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import ExplainableCard from '../../components/wastage/ExplainableCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { wastageService } from '../../services/wastageService';
import { useToast } from '../../context/ToastContext';
import { formatKWh } from '../../utils/formatters';

const WastageDetection = () => {
  const [summary, setSummary] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unresolved, critical
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const { toastSuccess } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sum, list] = await Promise.all([
          wastageService.getWastageSummary(),
          wastageService.getAnomalies(filter)
        ]);
        setSummary(sum);
        setAnomalies(list);
        if (list.length > 0 && !selectedAnomaly) {
          setSelectedAnomaly(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const handleResolve = async (id) => {
    await wastageService.resolveAnomaly(id);
    setAnomalies((prev) => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
    toastSuccess('Anomaly marked as resolved.');
    setDetailModalOpen(false);
  };

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
      header: "Actual",
      key: "consumption",
      sortable: true,
      render: (val) => <span className="font-bold text-forest-800 dark:text-emerald-400">{formatKWh(val)}</span>
    },
    {
      header: "Expected",
      key: "expected",
      sortable: true,
      render: (val) => <span className="text-slate-500">{formatKWh(val)}</span>
    },
    {
      header: "Difference",
      key: "differencePercent",
      sortable: true,
      render: (val) => <span className="font-bold text-rose-600 dark:text-rose-400">{val}</span>
    },
    {
      header: "Anomaly Score",
      key: "anomalyScore",
      sortable: true,
      render: (val) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {val ? val.toFixed(2) : "0.80"}
        </span>
      )
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
    },
    {
      header: "Action",
      key: "id",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedAnomaly(row);
            setActiveModalItem(row);
            setDetailModalOpen(true);
          }}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          Inspect
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="MACHINE LEARNING INFERENCE"
        title="Machine Learning Wastage Detection"
        subtitle="Unsupervised Isolation Forest algorithm isolating abnormal digital power surges and estimating energy loss."
      />

      {/* Major ML Status Panel matching prompt specification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Wastage Probability"
          value="78%"
          unit=""
          change="Confidence: 94.2%"
          trend="up"
          comparison="High anomaly probability"
          icon={Activity}
          iconBg="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
          highlight={true}
        />

        <StatCard
          title="Current Anomaly Score"
          value="0.84"
          unit="/ 1.0"
          change="Threshold: 0.60"
          trend="down"
          comparison="Statistical outlier"
          icon={BrainCircuit}
          iconBg="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
        />

        <StatCard
          title="Highest Severity"
          value="CRITICAL"
          unit=""
          change="Night Spike at 22:00"
          trend="down"
          comparison="Action recommended"
          icon={ShieldAlert}
          iconBg="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
        />

        <StatCard
          title="ML Detection Status"
          value="ACTIVE"
          unit=""
          change="Isolation Forest v1.0"
          trend="up"
          comparison="Continuous digital stream"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        />
      </div>

      {/* Explainable AI Diagnosis for Selected Anomaly */}
      {selectedAnomaly && (
        <ExplainableCard anomaly={selectedAnomaly} />
      )}

      {/* Detected Anomalies Data Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Detected Wastage & Outlier Events
            </h3>
            <p className="text-xs text-slate-500">
              Click "Inspect" on any record to view its explainable AI rationale and resolve the incident.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {['all', 'unresolved', 'critical'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filter === f
                    ? 'bg-white dark:bg-slate-700 text-forest-800 dark:text-emerald-300 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={anomalies}
          loading={loading}
          searchKey="time"
          searchPlaceholder="Search time or status..."
        />
      </div>

      {/* Anomaly Inspection Modal */}
      {activeModalItem && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Anomaly Event: ${activeModalItem.id}`}
          subtitle={`Detected at ${activeModalItem.date} ${activeModalItem.time}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Attributed Profile:</span>
                <span className="font-bold text-slate-900 dark:text-white">{activeModalItem.appliance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Actual vs Baseline:</span>
                <span className="font-bold text-rose-600">
                  {formatKWh(activeModalItem.consumption)} vs {formatKWh(activeModalItem.expected)} ({activeModalItem.differencePercent})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ML Anomaly Score:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeModalItem.anomalyScore}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Severity Tier:</span>
                <StatusBadge status={activeModalItem.severity} size="sm" />
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Explainable Diagnosis:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
                {activeModalItem.reason}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
              {activeModalItem.status !== 'Resolved' && (
                <Button variant="primary" size="sm" onClick={() => handleResolve(activeModalItem.id)}>
                  Mark as Resolved
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default WastageDetection;
