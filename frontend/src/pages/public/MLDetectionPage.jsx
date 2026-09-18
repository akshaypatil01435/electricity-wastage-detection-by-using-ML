import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, BrainCircuit, CheckCircle2, Sliders, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ModelMetricsBars from '../../components/charts/ModelMetricsBars';

const MLDetectionPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        category="ALGORITHM & DATA SCIENCE"
        title="Machine Learning Wastage Detection"
        subtitle="In-depth analysis of our unsupervised Isolation Forest architecture, training methodology, and statistical scoring framework."
        actions={
          <Link to="/ml-demo">
            <Button variant="primary" icon={ArrowRight} iconPosition="right">
              Try ML Demo
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Mathematical & Algorithmic details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-forest-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300">
              <BrainCircuit className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
              <span>Unsupervised Anomaly Isolation</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Why Isolation Forest for Electricity Wastage?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Traditional clustering algorithms (e.g. K-Means or DBSCAN) optimize for grouping normal instances and can be computationally expensive on continuous digital electricity time-series.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Isolation Forest</strong> directly isolates anomalous consumption instances by randomly selecting a feature and splitting the value. Because anomalous power surges (such as an AC running continuously at 3 AM) differ noticeably from baseline patterns, they require significantly fewer recursive partitions to isolate.
            </p>
          </div>

          {/* Feature Vector Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Input Feature Vector
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Hour of Day (0–23)</span>
                <span className="text-slate-500">Captures diurnal cyclic electricity routines</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Day of Week (0–6)</span>
                <span className="text-slate-500">Differentiates weekday vs. weekend consumption profiles</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Active Load Reading (kWh)</span>
                <span className="text-slate-500">Current digital consumption magnitude</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Rolling 3-Hour Median</span>
                <span className="text-slate-500">Smoothed baseline to detect sudden step surges</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Historical Variance</span>
                <span className="text-slate-500">Standard deviation for specific hour slot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Performance Card matching screenshot */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Model Performance Benchmark
            </h3>
            <ModelMetricsBars />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLDetectionPage;
