import React, { useState } from 'react';
import { Settings, Shield, Server, Database, BrainCircuit, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const AdminSettings = () => {
  const { toastSuccess } = useToast();

  const [backendConfig, setBackendConfig] = useState({
    apiBaseUrl: "http://localhost:8080/api",
    mlServiceUrl: "http://localhost:5000/ml",
    ingestionIntervalMins: 15,
    autoRetrainBatchSize: 10000,
    enableDemoMode: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    toastSuccess('System architecture configuration saved.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-slate-100">
      <PageHeader
        category="SYSTEM CONFIGURATION"
        title="Admin Settings"
        subtitle="Manage future Spring Boot API routing endpoints, ML microservice hooks, and ingestion intervals."
      />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-sm space-y-6 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Spring Boot & Microservices Endpoints</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Spring Boot REST API Base URL
              </label>
              <input
                type="text"
                value={backendConfig.apiBaseUrl}
                onChange={(e) => setBackendConfig({ ...backendConfig, apiBaseUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <p className="text-[10px] text-slate-500 mt-1">Configured in services/api.js via VITE_API_BASE_URL.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                ML Python Microservice URL
              </label>
              <input
                type="text"
                value={backendConfig.mlServiceUrl}
                onChange={(e) => setBackendConfig({ ...backendConfig, mlServiceUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Ingestion Batch Window (Mins)
              </label>
              <input
                type="number"
                value={backendConfig.ingestionIntervalMins}
                onChange={(e) => setBackendConfig({ ...backendConfig, ingestionIntervalMins: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Incremental Retraining Samples
              </label>
              <input
                type="number"
                value={backendConfig.autoRetrainBatchSize}
                onChange={(e) => setBackendConfig({ ...backendConfig, autoRetrainBatchSize: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <Button type="submit" variant="primary">
              Save Global Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
