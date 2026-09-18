import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Cpu,
  ShieldCheck,
  Activity,
  ArrowRight,
  Sparkles,
  BarChart3,
  Server
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import ChartCard from '../../components/common/ChartCard';
import StatusBadge from '../../components/common/StatusBadge';
import ModelMetricsBars from '../../components/charts/ModelMetricsBars';
import { adminService } from '../../services/adminService';
import { formatKWh } from '../../utils/formatters';

const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [kpiData, analyticsData] = await Promise.all([
          adminService.getAdminKPIs(),
          adminService.getAnalytics()
        ]);
        setKpis(kpiData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8 text-slate-100">
      <PageHeader
        category="ENTERPRISE SUPERVISION"
        title="Admin Overview Dashboard"
        subtitle="Global platform telemetry, user metrics, aggregate consumption analytics, and Isolation Forest ML health."
        actions={
          <Link to="/admin/ml-model">
            <button className="px-3.5 py-2 text-xs font-bold rounded-xl bg-forest-800 hover:bg-forest-700 text-white flex items-center gap-2 border border-emerald-600/40">
              <Cpu className="w-4 h-4 text-emerald-300" />
              <span>Model Controller</span>
            </button>
          </Link>
        }
      />

      {/* Admin KPIs matching prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">1,248</p>
          <p className="text-xs text-emerald-400 font-semibold">842 Active Today</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Analyzed Consumption</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">48,921 <span className="text-sm font-semibold text-slate-400">kWh</span></p>
          <p className="text-xs text-slate-400">+14.2% month-over-month</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Wastage Events Flagged</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400 mt-1">3,428</p>
          <p className="text-xs text-rose-300">184 Critical severity</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>ML Detection Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">94.2%</p>
          <p className="text-xs text-slate-400">Isolation Forest v1.0</p>
        </div>
      </div>

      {/* Model Benchmark Card + Top Wastage Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ML Performance Card matching screenshot */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Isolation Forest Performance</h3>
              <p className="text-xs text-slate-400">Live evaluation against 142,500 digital telemetry samples</p>
            </div>
            <Link to="/admin/ml-model" className="text-xs font-semibold text-emerald-400 hover:underline">
              Full Specs →
            </Link>
          </div>

          <ModelMetricsBars />
        </div>

        {/* Top Wastage Appliances & System Load */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Top Sources of Detected Wastage
            </h3>

            <div className="space-y-3">
              {analytics?.topWastageAppliances?.map((item) => (
                <div key={item.name} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">{item.name}</span>
                    <span className="text-emerald-400 font-bold">{item.percentage}% ({item.totalKWh} kWh)</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forest-800 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Links */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/admin/users"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-600/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">Manage Users</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/admin/wastage-events"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-600/60 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white">Wastage Events</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
