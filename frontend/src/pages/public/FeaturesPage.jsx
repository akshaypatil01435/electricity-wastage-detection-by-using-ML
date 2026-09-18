import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  PlayCircle,
  Cpu,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Zap,
  Sparkles
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const FeaturesPage = () => {
  const featureList = [
    {
      icon: BarChart3,
      title: "Interactive Consumption Analytics",
      description: "Comprehensive multi-timescale visualization spanning daily hourly breakdowns, 7-day trends, monthly billing cycles, and yearly aggregations with anomaly indicators."
    },
    {
      icon: AlertTriangle,
      title: "ML Anomaly & Wastage Detection",
      description: "Powered by Isolation Forest classifiers that evaluate power surges, unmonitored night loads, and continuous equipment cycling against baseline expectations."
    },
    {
      icon: BrainCircuit,
      title: "Explainable AI (XAI) Engine",
      description: "Transparent, plain-English justifications for flagged anomalies, revealing exact percentage baseline deviation, temporal context, and device attribution."
    },
    {
      icon: PlayCircle,
      title: "Digital Load Simulator",
      description: "Hardware-free real-time simulation sandbox with variable speeds and anomaly injectors (night AC surge, geyser overrun, idle workstation cluster)."
    },
    {
      icon: Cpu,
      title: "Digital Appliance Profiling",
      description: "Model digital consumption shares for ACs, refrigerators, water heaters, and electronics with cost estimations and efficiency recommendations."
    },
    {
      icon: Sparkles,
      title: "Predictive Forecasting",
      description: "Forecast consumption for the next 24 hours, 7 days, and 30 days with statistical upper and lower confidence intervals."
    },
    {
      icon: FileCheck2,
      title: "Executive Audit Reports",
      description: "Automated Daily, Weekly, and Monthly Energy Audit reports with instant PDF print layouts and CSV data export."
    },
    {
      icon: Calendar,
      title: "24x7 Hourly Heatmap",
      description: "Interactive visual matrix showing consumption intensity across all 168 hours of the week for rapid pattern discovery."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        category="CAPABILITIES"
        title="Comprehensive Energy Intelligence"
        subtitle="Explore the complete suite of features engineered for digital electricity monitoring, automated machine-learning detection, and cost optimization."
        actions={
          <Link to="/register">
            <Button variant="primary" icon={ArrowRight} iconPosition="right">
              Get Started
            </Button>
          </Link>
        }
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureList.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesPage;
