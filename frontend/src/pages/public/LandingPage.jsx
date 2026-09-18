import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  Cpu,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCheck2,
  Activity
} from 'lucide-react';
import Button from '../../components/common/Button';
import ModelMetricsBars from '../../components/charts/ModelMetricsBars';
import { APP_CONFIG } from '../../utils/constants';

const LandingPage = () => {
  const steps = [
    { num: "01", title: "Digital Consumption Data", desc: "The system receives or simulates digital electricity consumption data without hardware." },
    { num: "02", title: "Data Processing", desc: "Consumption data is cleaned, transformed, and prepared for high-accuracy feature extraction." },
    { num: "03", title: "Machine Learning Analysis", desc: "Machine-learning models analyze consumption patterns and identify subtle anomalies." },
    { num: "04", title: "Anomaly Detection", desc: "Abnormal usage patterns and outliers are flagged in real-time." },
    { num: "05", title: "Wastage Identification", desc: "Specific wastage events are categorized with severity levels and cost loss estimations." },
    { num: "06", title: "Recommendations", desc: "Actionable, explainable energy-saving suggestions are generated to reduce your electricity bills." }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Consumption Analytics",
      desc: "Visualize daily, weekly, monthly and yearly electricity usage with interactive charts."
    },
    {
      icon: AlertTriangle,
      title: "Wastage Detection",
      desc: "Machine-learning analysis flags abnormal consumption patterns in real time."
    },
    {
      icon: BrainCircuit,
      title: "Explainable AI (XAI)",
      desc: "Plain-language diagnostic rationale explains exactly why every anomaly was detected."
    },
    {
      icon: PlayCircle,
      title: "Digital Simulator",
      desc: "Interactive testing sandbox to simulate load spikes, night leaks, and appliance overruns."
    },
    {
      icon: Cpu,
      title: "Digital Appliance Profiling",
      desc: "Model appliance-level energy breakdowns and identify your top energy-draining devices."
    },
    {
      icon: FileCheck2,
      title: "Automated Energy Audits",
      desc: "Generate comprehensive daily, weekly, and monthly audit reports with CSV/PDF exports."
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/60 dark:bg-emerald-950/20 blur-[100px] -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-forest-800 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                <span>{APP_CONFIG.brandName} · {APP_CONFIG.tagline}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Detect Electricity Wastage{' '}
                <span className="text-forest-800 dark:text-emerald-400">Before It Becomes a Problem.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                An intelligent machine-learning platform that analyzes electricity consumption patterns, detects abnormal usage, and provides actionable energy-saving recommendations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to="/register">
                  <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right" className="shadow-md">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/simulator">
                  <Button size="lg" variant="secondary" icon={PlayCircle}>
                    Live Simulator Demo
                  </Button>
                </Link>
              </div>

              {/* Micro stats banner */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 dark:border-slate-800 text-left">
                <div>
                  <p className="text-xl font-extrabold text-forest-800 dark:text-emerald-400">24/7</p>
                  <p className="text-xs text-slate-500 font-medium">Digital Analysis</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">94.2%</p>
                  <p className="text-xs text-slate-500 font-medium">ML Detection Rate</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">100%</p>
                  <p className="text-xs text-slate-500 font-medium">Software Based</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">₹3,200+</p>
                  <p className="text-xs text-slate-500 font-medium">Avg Annual Savings</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visualizer Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live Stream Ticker</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Digital Load Feed</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    Anomaly Flagged
                  </span>
                </div>

                {/* Animated simulated metric */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Current Consumption</span>
                      <p className="text-3xl font-extrabold text-forest-900 dark:text-white mt-0.5">2.84 <span className="text-sm font-bold text-slate-500">kWh</span></p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Baseline Expected</span>
                      <p className="text-xl font-bold text-slate-600 dark:text-slate-300 mt-0.5">1.10 <span className="text-xs font-semibold">kWh</span></p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/50 flex items-center justify-between text-xs font-semibold">
                    <span className="text-rose-600 dark:text-rose-400">+155% Deviation detected</span>
                    <span className="text-forest-800 dark:text-emerald-300">Score: 0.94</span>
                  </div>
                </div>

                {/* Pipeline visualizer in hero */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ML Processing Pipeline</span>
                  <div className="grid grid-cols-4 gap-1.5 text-center font-bold text-[10px]">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      1. Data
                    </div>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      2. Clean
                    </div>
                    <div className="p-2 rounded-lg bg-forest-800 text-white shadow-xs">
                      3. ML Match
                    </div>
                    <div className="p-2 rounded-lg bg-rose-600 text-white shadow-xs">
                      4. Alert
                    </div>
                  </div>
                </div>

                {/* Explainable AI snippet */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <BrainCircuit className="w-3.5 h-3.5 text-forest-700 dark:text-emerald-400" />
                    <span>Explainable Diagnosis:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Unusual power draw detected during night hours. Air Conditioner left running continuously without sleep timer.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section matching screenshot media_1787464793000.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-emerald-400">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            From Digital Feed to Actionable Energy Savings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            A comprehensive, transparent software pipeline designed for maximum accuracy and explainability.
          </p>
        </div>

        {/* Numbered Step Badges matching screenshot media_1787464793000.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col items-center text-center space-y-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow"
            >
              {/* Circular green numbered badge matching screenshot */}
              <div className="w-14 h-14 rounded-full border-2 border-forest-800 dark:border-emerald-500 text-forest-800 dark:text-emerald-400 font-extrabold flex items-center justify-center text-lg bg-white dark:bg-slate-900">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section matching screenshot media_1787464792998.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-12">
          {/* Header tag matching screenshot */}
          <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-emerald-400 block">
            FEATURES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything you need to manage energy
          </h2>
        </div>

        {/* Feature Cards matching screenshot media_1787464792998.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                {/* Light pale mint/emerald background icon container matching screenshot */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-forest-800 dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Model Performance & Architecture matching screenshot media_1787464793034.jpg */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-700 dark:text-emerald-400">
                MACHINE LEARNING BENCHMARK
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Powered by Isolation Forest Anomaly Detection
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Our model maps multi-dimensional digital consumption features (hour, day of week, active load profile, and historical rolling medians) into an unsupervised isolation space. Anomalies are isolated significantly faster than standard baseline consumption.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                  <span>Unsupervised detection requires zero manual labeling.</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                  <span>Configurable anomaly sensitivity threshold (default 0.60).</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-forest-800 dark:text-emerald-400 shrink-0" />
                  <span>Ready for Spring Boot REST API integration with JSON payload exchange.</span>
                </div>
              </div>
              <div className="pt-4">
                <Link to="/ml-demo">
                  <Button variant="primary" icon={ArrowRight} iconPosition="right">
                    Try Interactive ML Testbench
                  </Button>
                </Link>
              </div>
            </div>

            {/* Model metrics bars & card matching screenshot media_1787464793034.jpg */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  Model Evaluation Metrics (v1.0)
                </h3>
                <ModelMetricsBars />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Ready to eliminate electricity wastage in your home or facility?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Experience the power of machine learning anomaly detection. Explore simulated datasets, test explainable AI diagnoses, and view interactive energy dashboards today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-forest-900 hover:bg-emerald-50 border-none font-bold">
                Get Started Now
              </Button>
            </Link>
            <Link to="/presentation">
              <Button size="lg" variant="outline" className="text-white border-emerald-400/60 hover:bg-forest-800">
                Viva Presentation Mode
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
