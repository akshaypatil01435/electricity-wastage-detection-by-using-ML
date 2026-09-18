import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, FileSpreadsheet, Plus } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { reportService } from '../../services/reportService';
import { exportToCSV, triggerPrintReport } from '../../utils/exportUtils';
import { formatCurrency, formatKWh } from '../../utils/formatters';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
    exportToCSV(data, `admin_${rep.id}_export.csv`);
  };

  return (
    <div className="space-y-8 text-slate-100">
      <PageHeader
        category="EXECUTIVE AUDIT SUITE"
        title="Admin Reports & Benchmarks"
        subtitle="Global electricity consumption audits, aggregate wastage summaries, and compliance exports."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {rep.type}
                  </span>
                  <h3 className="text-sm font-bold text-white">{rep.title}</h3>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">{rep.period}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-2xl">
              {rep.summaryText}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Load</span>
                <p className="font-bold text-emerald-400">{formatKWh(rep.totalConsumption)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Wastage</span>
                <p className="font-bold text-rose-400">{formatKWh(rep.detectedWastage)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Loss Cost</span>
                <p className="font-bold text-white">{formatCurrency(rep.estimatedCost)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Efficiency Benchmark: <strong className="text-emerald-400">{rep.efficiencyScore}%</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={triggerPrintReport}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleExportCSV(rep)}
                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800"
                  title="Export CSV"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
