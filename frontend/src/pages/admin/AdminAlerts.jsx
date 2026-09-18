import React, { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle2, ShieldAlert, AlertTriangle, Trash2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { alertService } from '../../services/alertService';
import { useToast } from '../../context/ToastContext';

const AdminAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState('HIGH');
  const [loading, setLoading] = useState(true);

  const { toastSuccess } = useToast();

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

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage) return;

    const newAlt = {
      id: `alt_${Date.now()}`,
      type: "System Notification",
      severity: broadcastSeverity,
      title: "Administrator Broadcast",
      message: broadcastMessage,
      timestamp: "Just now",
      read: false,
      kwhImpact: 0,
      costImpact: 0,
      category: "system"
    };

    setAlerts([newAlt, ...alerts]);
    toastSuccess('System broadcast dispatched to all active users.');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        category="DISPATCH & BROADCAST"
        title="Admin Alert Center"
        subtitle="Manage global system-wide notifications and broadcast critical grid warnings to all connected user dashboards."
      />

      {/* Broadcast Form */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-emerald-400" />
          <span>Dispatch System-Wide Announcement</span>
        </h3>

        <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Enter alert message to broadcast to all subscribers..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
            <div>
              <select
                value={broadcastSeverity}
                onChange={(e) => setBroadcastSeverity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                <option value="CRITICAL">Critical Alert</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Notice</option>
                <option value="LOW">Informational</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" icon={Send}>
              Dispatch Announcement
            </Button>
          </div>
        </form>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">Global Alert Feed ({alerts.length})</h3>
        {alerts.map((alt) => (
          <div
            key={alt.id}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white">{alt.title}</h4>
                  <StatusBadge status={alt.severity} size="sm" />
                </div>
                <p className="text-slate-400 mt-0.5">{alt.message}</p>
                <span className="text-[10px] text-slate-500">{alt.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAlerts;
