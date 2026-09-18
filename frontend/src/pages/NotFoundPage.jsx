import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The electricity telemetry page you requested does not exist or has been relocated.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="outline" icon={ArrowLeft}>
            Home
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            User Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
