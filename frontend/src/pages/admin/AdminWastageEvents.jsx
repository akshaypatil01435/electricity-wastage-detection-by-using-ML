import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Filter,
  ShieldAlert
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { formatKWh } from '../../utils/formatters';

const AdminWastageEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const { toastSuccess } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await adminService.getWastageEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleAction = async (eventId, type) => {
    await adminService.resolveWastageEvent(eventId, type);
    const newStatus = type === 'false_positive' ? 'False Positive' : 'Resolved';
    setEvents(events.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    toastSuccess(`Event updated to ${newStatus}.`);
    setModalOpen(false);
  };

  const filtered = events.filter(e => {
    if (severityFilter === 'ALL') return true;
    return e.severity === severityFilter;
  });

  const columns = [
    {
      header: "Event ID",
      key: "id",
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-white text-[11px]">{val}</span>
    },
    {
      header: "Timestamp",
      key: "time",
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-bold text-white block">{row.time}</span>
          <span className="text-[10px] text-slate-400">{row.date}</span>
        </div>
      )
    },
    {
      header: "Actual Load",
      key: "consumption",
      sortable: true,
      render: (val) => <span className="font-bold text-emerald-400">{formatKWh(val)}</span>
    },
    {
      header: "Expected",
      key: "expected",
      sortable: true,
      render: (val) => <span className="text-slate-400">{formatKWh(val)}</span>
    },
    {
      header: "Difference",
      key: "differencePercent",
      sortable: true,
      render: (val) => <span className="font-bold text-rose-400">{val}</span>
    },
    {
      header: "Score",
      key: "anomalyScore",
      sortable: true,
      render: (val) => <span className="font-mono font-bold text-white">{val}</span>
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
        <span className={`text-xs font-semibold ${
          val === 'Resolved' ? 'text-emerald-400' : val === 'False Positive' ? 'text-slate-400' : 'text-amber-400'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "Actions",
      key: "id",
      align: "right",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedEvent(row);
            setModalOpen(true);
          }}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
        >
          Review
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        category="INCIDENT AUDIT TRAIL"
        title="Global Wastage Events"
        subtitle="Manage and triage real-time electricity wastage events detected across all subscriber profiles."
      />

      {/* Severity Filter buttons */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400">Severity:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              severityFilter === sev
                ? 'bg-forest-800 text-white font-bold'
                : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKey="id"
        searchPlaceholder="Search event ID or profile..."
      />

      {/* Review Modal */}
      {selectedEvent && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Review Event: ${selectedEvent.id}`}
          subtitle={`Logged at ${selectedEvent.date} ${selectedEvent.time}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Attributed Profile:</span>
                <span className="font-bold text-white">{selectedEvent.appliance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consumption:</span>
                <span className="font-bold text-rose-400">{formatKWh(selectedEvent.consumption)} (Baseline: {formatKWh(selectedEvent.expected)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anomaly Score:</span>
                <span className="font-mono font-bold text-white">{selectedEvent.anomalyScore}</span>
              </div>
            </div>

            <div className="p-3.5 bg-forest-950/80 border border-emerald-800/80 rounded-xl space-y-1">
              <span className="font-bold text-emerald-300">Explainable AI Rationale:</span>
              <p className="text-slate-300">{selectedEvent.reason}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleAction(selectedEvent.id, 'false_positive')}>
                Mark False Positive
              </Button>
              <Button variant="primary" size="sm" onClick={() => handleAction(selectedEvent.id, 'resolve')}>
                Resolve Incident
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminWastageEvents;
