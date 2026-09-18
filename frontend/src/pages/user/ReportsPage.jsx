import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Plus,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Zap,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { exportToCSV, triggerPrintReport } from '../../utils/exportUtils';
import { formatCurrency, formatKWh } from '../../utils/formatters';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('Daily Report');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const { toastSuccess } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const newReport = await reportService.generateReport(selectedType);
      setReports([newReport, ...reports]);
      toastSuccess(`${selectedType} generated successfully.`);
      setGenerateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = (rep) => {
    const data = [{
      ReportID: rep.id,
      Type: rep.type,
      Period: rep.period,
      Date: rep.date,
      TotalConsumptionKWh: rep.totalConsumption,
      ExpectedConsumptionKWh: rep.expectedConsumption,
      DetectedWastageKWh: rep.detectedWastage,
      EstimatedCostINR: rep.estimatedCost,
      EfficiencyScorePct: rep.efficiencyScore,
      PeakConsumption: rep.peakConsumption,
      AnomalyCount: rep.anomalyCount
    }];
    exportToCSV(data, `${rep.id}_export.csv`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        category="ENERGY AUDIT & EXPORTS"
        title="Energy Reports & Audits"
        subtitle="Generate, preview, print, and export comprehensive daily, weekly, and monthly electricity efficiency reports."
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setGenerateModalOpen(true)}>
            Generate New Report
          </Button>
        }
      />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 dark:text-emerald-400">
                    {rep.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rep.title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">{rep.period}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
              {rep.summaryText}
            </p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Load</span>
                <p className="font-bold text-forest-800 dark:text-emerald-400">{formatKWh(rep.totalConsumption)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Wastage</span>
                <p className="font-bold text-rose-600 dark:text-rose-400">{formatKWh(rep.detectedWastage)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Cost</span>
                <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(rep.estimatedCost)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 font-medium">
                Efficiency: <strong className="text-emerald-600">{rep.efficiencyScore}%</strong> ({rep.anomalyCount} anomalies)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrintReport}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleExportCSV(rep)}
                  className="p-1.5 text-slate-400 hover:text-forest-800 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100"
                  title="Export CSV"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Automated Audit Report"
        subtitle="Select the audit scope and analytical timeframe."
      >
        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Report Category
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-forest-800"
            >
              <option value="Daily Report">Daily Consumption & Wastage Summary</option>
              <option value="Weekly Report">Weekly Trend & Pattern Analysis</option>
              <option value="Monthly Report">Monthly Digital Energy Audit</option>
              <option value="Wastage Report">Comprehensive ML Wastage & Loss Report</option>
              <option value="Energy Efficiency Report">Carbon & Energy Efficiency Benchmark</option>
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-forest-900 dark:text-emerald-200 space-y-1">
            <p className="font-bold">Automated Analysis:</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              The engine will compute statistical baseline deviations, total kilowatt-hour loss, and attach current Explainable AI recommendations.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={generating}>
              Generate Report
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReportsPage;
