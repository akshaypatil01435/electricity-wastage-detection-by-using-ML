import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Sun,
  Moon,
  Laptop,
  Lock,
  Zap,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toastSuccess } = useToast();

  const [notifications, setNotifications] = useState({
    wastageAlerts: true,
    highConsumptionAlerts: true,
    recommendationUpdates: true,
    emailDigest: false
  });

  const [energySettings, setEnergySettings] = useState({
    tariff: 7.50,
    monthlyGoal: 450,
    unit: 'kWh',
    threshold: 0.60
  });

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess('Settings updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        category="PREFERENCES & CONFIGURATION"
        title="Settings"
        subtitle="Configure appearance themes, automated wastage alerts, tariff thresholds, and notification preferences."
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Sun className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
            <span>Theme & Appearance</span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { key: 'light', label: 'Light', icon: Sun },
              { key: 'dark', label: 'Dark', icon: Moon },
              { key: 'system', label: 'System', icon: Laptop }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    theme === t.key
                      ? 'border-forest-800 bg-emerald-50 text-forest-900 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700 ring-2 ring-forest-700/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Bell className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
            <span>Notification & Wastage Alerts</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Critical Wastage Alerts</p>
                <p className="text-[11px] text-slate-400">Receive immediate alerts when anomaly score crosses 0.78</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.wastageAlerts}
                onChange={(e) => setNotifications({ ...notifications, wastageAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">High Consumption Warnings</p>
                <p className="text-[11px] text-slate-400">Notify when daily consumption exceeds expected baseline by +50%</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.highConsumptionAlerts}
                onChange={(e) => setNotifications({ ...notifications, highConsumptionAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">AI Recommendation Updates</p>
                <p className="text-[11px] text-slate-400">Receive periodic optimization summaries and saving tips</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.recommendationUpdates}
                onChange={(e) => setNotifications({ ...notifications, recommendationUpdates: e.target.checked })}
                className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700"
              />
            </div>
          </div>
        </div>

        {/* Energy Tariff & Model Parameters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Zap className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
            <span>Energy Tariff & ML Threshold</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Electricity Tariff (₹ per kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={energySettings.tariff}
                onChange={(e) => setEnergySettings({ ...energySettings, tariff: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Goal (kWh)
              </label>
              <input
                type="number"
                value={energySettings.monthlyGoal}
                onChange={(e) => setEnergySettings({ ...energySettings, monthlyGoal: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
