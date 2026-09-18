import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Wind,
  Refrigerator,
  Flame,
  Disc,
  Monitor,
  Tv,
  Lightbulb,
  Fan,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import ChartCard from '../../components/common/ChartCard';
import ApplianceDonutChart from '../../components/charts/ApplianceDonutChart';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { consumptionService } from '../../services/consumptionService';
import { useToast } from '../../context/ToastContext';
import { formatKWh, formatCurrency } from '../../utils/formatters';

const iconMap = {
  Wind: Wind,
  Refrigerator: Refrigerator,
  Flame: Flame,
  Disc: Disc,
  Monitor: Monitor,
  Tv: Tv,
  Lightbulb: Lightbulb,
  Fan: Fan
};

const ApplianceAnalysis = () => {
  const [appliances, setAppliances] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    consumptionKWh: 30,
    avgHoursPerDay: 4,
    ratedPowerWatts: 500,
    location: 'Main Room',
    iconName: 'Cpu'
  });
  const [loading, setLoading] = useState(true);

  const { toastSuccess } = useToast();

  useEffect(() => {
    const fetchAppliances = async () => {
      setLoading(true);
      try {
        const data = await consumptionService.getApplianceBreakdown();
        setAppliances(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliances();
  }, []);

  const totalKWh = appliances.reduce((sum, a) => sum + a.consumptionKWh, 0);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'General',
      consumptionKWh: 25,
      avgHoursPerDay: 4,
      ratedPowerWatts: 400,
      location: 'Living Area',
      iconName: 'Cpu'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (app) => {
    setEditingItem(app);
    setFormData({ ...app });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await consumptionService.deleteAppliance(id);
    setAppliances((prev) => prev.filter(a => a.id !== id));
    toastSuccess('Appliance profile removed.');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const c = Number(formData.consumptionKWh) || 10;
    const cost = Math.round(c * 7.5);
    const pct = +(c / Math.max(totalKWh, 1) * 100).toFixed(1);

    if (editingItem) {
      const updated = appliances.map(a => a.id === editingItem.id ? {
        ...a,
        ...formData,
        consumptionKWh: c,
        estimatedCost: cost,
        percentage: pct
      } : a);
      setAppliances(updated);
      toastSuccess(`Updated ${formData.name}`);
    } else {
      const newItem = {
        id: `app_${Date.now()}`,
        ...formData,
        consumptionKWh: c,
        estimatedCost: cost,
        percentage: pct,
        efficiencyStatus: c > 100 ? "High Wastage" : "Optimal",
        efficiencyColor: c > 100 ? "rose" : "emerald",
        isAnomalous: c > 100
      };
      setAppliances([...appliances, newItem]);
      toastSuccess(`Added ${formData.name}`);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        category="DIGITAL LOAD ESTIMATION"
        title="Appliance-Level Analysis"
        subtitle="Digitally entered and simulated appliance consumption load breakdown and efficiency status."
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Digital Appliance
          </Button>
        }
      />

      {/* Software Simulation Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-forest-900 dark:text-emerald-200 font-medium">
          <Cpu className="w-4 h-4 text-forest-700 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Digital Load Profile:</strong> Appliance breakdown is computed via statistical load disaggregation and user profile parameters without physical sub-meters.
          </span>
        </div>
      </div>

      {/* Donut Chart + Top Consumers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <ChartCard
            title="Appliance Consumption Distribution"
            subtitle={`Total estimated appliance footprint: ${formatKWh(totalKWh)}`}
          >
            <ApplianceDonutChart appliances={appliances} />
          </ChartCard>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Top Energy Consuming Devices
          </h3>

          <div className="space-y-3">
            {appliances.slice(0, 4).map((app, idx) => {
              const Icon = iconMap[app.iconName] || Cpu;
              return (
                <div
                  key={app.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</h4>
                      <p className="text-[11px] text-slate-500">{app.location} · {app.avgHoursPerDay} hrs/day</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-forest-800 dark:text-emerald-400">{formatKWh(app.consumptionKWh)}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{app.percentage}% of total (₹{app.estimatedCost})</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Complete Appliance Cards Grid with Edit / Delete */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Configured Appliance Profiles ({appliances.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appliances.map((app) => {
            const Icon = iconMap[app.iconName] || Cpu;
            return (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(app)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Remove Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</h4>
                  <p className="text-[11px] text-slate-400">{app.category} · {app.ratedPowerWatts}W</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Usage:</span>
                    <span className="font-bold text-forest-800 dark:text-emerald-400">{formatKWh(app.consumptionKWh)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Cost:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">₹{app.estimatedCost}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <StatusBadge status={app.efficiencyStatus} size="sm" />
                  <span className="text-[11px] font-bold text-slate-500">{app.percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Appliance Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit ${editingItem.name}` : "Add Digital Appliance Profile"}
        subtitle="Configure estimated rated wattage and daily operating hours."
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Appliance Name
            </label>
            <input
              type="text"
              placeholder="e.g. Master Bedroom Inverter AC"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              >
                <option value="Cooling">Cooling</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Heating">Heating</option>
                <option value="Laundry">Laundry</option>
                <option value="Electronics">Electronics</option>
                <option value="Lighting">Lighting</option>
                <option value="Circulation">Circulation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rated Power (Watts)
              </label>
              <input
                type="number"
                value={formData.ratedPowerWatts}
                onChange={(e) => setFormData({ ...formData, ratedPowerWatts: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daily Usage Hours
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.avgHoursPerDay}
                onChange={(e) => setFormData({ ...formData, avgHoursPerDay: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Est. (kWh)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.consumptionKWh}
                onChange={(e) => setFormData({ ...formData, consumptionKWh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editingItem ? "Save Changes" : "Create Profile"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ApplianceAnalysis;
