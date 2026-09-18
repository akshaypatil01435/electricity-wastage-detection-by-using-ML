import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import { alertService } from '../../services/alertService';
import { useToast } from '../../context/ToastContext';

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  const { toastSuccess, toastInfo } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await alertService.getAlerts();
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id) => {
    await alertService.markAsRead(id);
    setAlerts((prev) => prev.map(a => a.id === id ? { ...a, read: true } : a));
    toastInfo('Alert marked as read.');
  };

  const handleMarkAllRead = async () => {
    await alertService.markAllAsRead();
    setAlerts((prev) => prev.map(a => ({ ...a, read: true })));
    toastSuccess('All alerts marked as read.');
  };

  const handleDelete = async (id) => {
    await alertService.deleteAlert(id);
    setAlerts((prev) => prev.filter(a => a.id !== id));
    toastSuccess('Alert removed.');
  };

  const categories = [
    { key: 'all', label: 'All Alerts' },
    { key: 'wastage', label: 'Critical Wastage' },
    { key: 'abnormal', label: 'Abnormal Usage' },
    { key: 'high', label: 'High Load' },
    { key: 'prediction', label: 'Prediction Warnings' },
    { key: 'recommendation', label: 'Recommendations' },
    { key: 'system', label: 'System' }
  ];

  const filteredAlerts = alerts.filter(a => {
    if (filterType === 'all') return true;
    return a.category === filterType;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-8">
      <PageHeader
        category="INCIDENT NOTIFICATIONS"
        title="Alert Center"
        subtitle="Manage and investigate automated electricity wastage anomalies, abnormal consumption notifications, and system alerts."
        actions={
          unreadCount > 0 && (
            <Button size="sm" variant="secondary" icon={CheckCircle2} onClick={handleMarkAllRead}>
              Mark All as Read ({unreadCount})
            </Button>
          )
        }
      />

      {/* Filter Category Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilterType(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filterType === c.key
                ? 'bg-forest-800 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400">
            No alerts found in this category.
          </div>
        ) : (
          filteredAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !alt.read
                  ? 'border-forest-700/40 bg-emerald-50/10 dark:border-emerald-700/40'
                  : 'border-slate-200/80 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  alt.severity === 'CRITICAL'
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : alt.severity === 'HIGH'
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                    : 'bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}>
                  {alt.severity === 'CRITICAL' ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{alt.title}</h4>
                    <StatusBadge status={alt.severity} size="sm" />
                    {!alt.read && (
                      <span className="w-2 h-2 rounded-full bg-forest-700 dark:bg-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {alt.message}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{alt.timestamp}</span>
                    {alt.kwhImpact > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-rose-600 font-semibold">Impact: {alt.kwhImpact} kWh (₹{alt.costImpact})</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!alt.read && (
                  <button
                    onClick={() => handleMarkRead(alt.id)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-forest-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(alt.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertCenter;
