import React, { useState } from 'react';
import { Shield, Mail, Key, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminProfile = () => {
  const { user } = useAuth();
  const { toastSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'System Administrator',
    email: user?.email || 'admin@wattvision.ai',
    role: 'ROLE_ADMIN'
  });

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess('Admin profile updated.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
      <PageHeader
        category="ADMINISTRATOR ACCOUNT"
        title="Admin Profile"
        subtitle="Manage master supervisor access and system operational roles."
      />

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
            alt="Admin"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{formData.name}</h3>
            <p className="text-xs text-slate-400">{formData.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-900 text-emerald-300 border border-emerald-700">
              System Superuser
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-500 text-xs cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="primary">
              Save Admin Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
