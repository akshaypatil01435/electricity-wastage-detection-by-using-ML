import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Layers,
  Calendar,
  Users,
  Activity
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import WastageAreaChart from '../../components/charts/WastageAreaChart';
import { adminService } from '../../services/adminService';
import { formatKWh } from '../../utils/formatters';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 text-slate-100">
      <PageHeader
        category="ENTERPRISE INTELLIGENCE"
        title="System Analytics & Trends"
        subtitle="Multi-dimensional analytics examining monthly consumption growth, anomaly distributions, and severity proportions."
      />

      {/* 2-Column Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Monthly Growth */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            Monthly Consumption vs Wastage Growth (kWh)
          </h3>
          <WastageAreaChart data={analytics?.monthlyGrowth || []} xKey="month" height={280} />
        </div>

        {/* Severity Distribution */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            Wastage Events by Severity Classification
          </h3>

          <div className="space-y-3 pt-2">
            {analytics?.wastageBySeverity?.map((sev) => (
              <div key={sev.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">{sev.name} Severity</span>
                  <span className="text-white font-bold">{sev.value.toLocaleString()} events</span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(sev.value / 3428) * 100}%`, backgroundColor: sev.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Consuming Appliances Breakdown */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
          Appliance Category Load Contribution Across All Subscribed Households
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {analytics?.topWastageAppliances?.map((item) => (
            <div key={item.name} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold">{item.name}</span>
              <p className="text-xl font-bold text-emerald-400">{item.percentage}%</p>
              <p className="text-[11px] text-slate-500">{item.totalKWh} kWh aggregate wastage</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
