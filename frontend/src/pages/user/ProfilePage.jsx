import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, Target, Zap, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Akshay Patil',
    email: user?.email || 'demo@wattvision.ai',
    phone: user?.phone || '+91 98765 43210',
    monthlyGoalKWh: user?.monthlyGoalKWh || 450,
    electricityTariff: user?.electricityTariff || 7.50
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toastSuccess('Profile updated successfully!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        category="ACCOUNT MANAGEMENT"
        title="User Profile"
        subtitle="Manage your personal profile, monthly consumption budget goals, and regional electricity tariff rates."
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-8">
        {/* User Badge */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={formData.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-forest-700/40"
          />
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h3>
            <p className="text-xs text-slate-400">{formData.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-forest-800 border border-emerald-200">
                Active Subscriber
              </span>
              <span className="text-xs text-slate-400">Joined Jan 2026</span>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Monthly Target Budget (kWh)
              </label>
              <input
                type="number"
                value={formData.monthlyGoalKWh}
                onChange={(e) => setFormData({ ...formData, monthlyGoalKWh: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Electricity Tariff (₹ per kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.electricityTariff}
                onChange={(e) => setFormData({ ...formData, electricityTariff: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
