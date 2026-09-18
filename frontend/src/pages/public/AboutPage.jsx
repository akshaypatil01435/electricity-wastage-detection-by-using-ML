import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Code2, Server, Database, BrainCircuit, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import { APP_CONFIG } from '../../utils/constants';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <PageHeader
        category="CAPSTONE PROJECT OVERVIEW"
        title="About WattVision AI"
        subtitle="Electricity Wastage Detection Using Machine Learning — Final Year Engineering Capstone Project"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Project Motivation & Problem Statement
            </h2>
            <p>
              Electricity wastage in residential and commercial facilities represents up to <strong>20–30% of total electrical energy costs</strong>. Much of this loss occurs invisibly due to unattended cooling devices, degraded appliance efficiency, faulty thermostats, and high baseline phantom loads during non-operational hours.
            </p>
            <p>
              <strong>WattVision AI</strong> solves this challenge through a pure software and machine-learning intelligence platform. It analyzes digital consumption patterns, isolates abnormal load events in real time, and explains exactly why wastage occurred so users can take immediate corrective action.
            </p>
          </div>

          {/* Technical Stack Overview */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Planned Full-Stack Architecture
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest-800 dark:text-emerald-400 text-sm">
                  <Code2 className="w-4 h-4" />
                  <span>Frontend Client</span>
                </div>
                <p className="text-slate-500">React.js, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, Context API.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest-800 dark:text-emerald-400 text-sm">
                  <Server className="w-4 h-4" />
                  <span>Backend REST API</span>
                </div>
                <p className="text-slate-500">Java, Spring Boot, Spring Security, JWT Token Authentication, RESTful Controllers.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest-800 dark:text-emerald-400 text-sm">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Machine Learning</span>
                </div>
                <p className="text-slate-500">Python Scikit-Learn, Isolation Forest Anomaly Detection, FastAPI/REST ML Microservice.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-forest-800 dark:text-emerald-400 text-sm">
                  <Database className="w-4 h-4" />
                  <span>Database Layer</span>
                </div>
                <p className="text-slate-500">MySQL Database, JPA/Hibernate ORM, Relational Time-series Schemas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-forest-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <h3 className="text-base font-bold">100% Software Implementation</h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              This academic capstone project focuses strictly on algorithms, software architecture, data modeling, and explainable AI interfaces.
            </p>
            <div className="p-3 bg-forest-950/80 rounded-xl border border-emerald-700/80 text-[11px] space-y-1">
              <p className="font-semibold text-emerald-300">No IoT Hardware Needed</p>
              <p className="text-slate-300">Operates seamlessly using digital smart meter logs, simulated digital tickers, and API streams.</p>
            </div>
            <Link to="/simulator" className="block pt-2">
              <Button variant="secondary" size="sm" className="w-full bg-white text-forest-900 hover:bg-emerald-50 border-none font-bold">
                Launch Live Simulator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
