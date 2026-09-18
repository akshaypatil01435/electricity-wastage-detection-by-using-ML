import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileCode,
  Sparkles,
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';

const HowItWorksPage = () => {
  const steps = [
    {
      step: "01",
      title: "Digital Consumption Data Ingestion",
      desc: "The platform ingests digital, simulated, or imported electricity consumption time-series data. No physical IoT hardware is required.",
      points: ["15-minute / 1-hour interval digital feeds", "CSV, JSON, or simulated digital streams", "Multi-appliance load signatures"]
    },
    {
      step: "02",
      title: "Data Processing & Feature Extraction",
      desc: "Incoming consumption signals are filtered, normalized, and mapped into statistical feature matrices.",
      points: ["Noise filtering and outlier smoothing", "Cyclic time encoding (Hour, Day of week)", "Baseline median calculation & rolling averages"]
    },
    {
      step: "03",
      title: "Machine Learning Analysis",
      desc: "Unsupervised machine learning algorithms evaluate the sample against historical and peer load distributions.",
      points: ["Isolation Forest decision tree space partitioning", "Unsupervised classification without manual labeling", "Real-time anomaly scoring (0.0 to 1.0)"]
    },
    {
      step: "04",
      title: "Anomaly Detection & Severity Ranking",
      desc: "Readings exceeding the dynamic sensitivity threshold (0.60) are tagged with severity tiers.",
      points: ["Low, Medium, High, and Critical classifications", "Sudden surge & deep night leak detection", "False-positive suppression filtering"]
    },
    {
      step: "05",
      title: "Explainable AI (XAI) Diagnosis",
      desc: "The reasoning engine produces clear, human-understandable explanations for each identified event.",
      points: ["Baseline deviation percentages (+155% vs baseline)", "Time-of-day contextual analysis", "Attributed appliance consumption breakdown"]
    },
    {
      step: "06",
      title: "Intelligent Recommendations & Savings",
      desc: "Actionable, prioritized energy-saving advice is generated to reduce kilowatt-hours and financial costs.",
      points: ["Thermostat and timer optimization suggestions", "Estimated monthly ₹ and kWh financial impact", "One-click action tracking and resolution"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        category="ARCHITECTURE & WORKFLOW"
        title="How WattVision AI Operates"
        subtitle="A transparent, six-stage machine learning workflow transforming digital electricity data into verified energy savings."
        actions={
          <Link to="/simulator">
            <Button variant="primary" icon={ArrowRight} iconPosition="right">
              Test in Simulator
            </Button>
          </Link>
        }
      />

      {/* Visual Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full border-2 border-forest-800 dark:border-emerald-500 text-forest-800 dark:text-emerald-400 font-black flex items-center justify-center text-lg">
                {item.step}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-emerald-400">
                Stage {idx + 1}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {item.desc}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              {item.points.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-forest-700 dark:bg-emerald-400 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Software Architecture callout */}
      <div className="p-8 rounded-3xl bg-forest-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">100% Software Architecture Guarantee</h3>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            WattVision AI operates purely on software pipelines and digital data feeds. It requires zero physical smart meters, ESP32 boards, or electrical sensor hardware.
          </p>
        </div>
        <Link to="/ml-demo">
          <Button variant="secondary" className="bg-white text-forest-900 hover:bg-emerald-50 shrink-0 font-bold">
            Try ML Testbench
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
