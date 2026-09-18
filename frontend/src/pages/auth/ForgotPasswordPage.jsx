import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toastSuccess } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toastSuccess('Password reset link sent to your email!');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="flex justify-start">
          <Logo size="md" showTagline={false} />
        </div>

        {!submitted ? (
          <>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Reset your password
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Enter your email and we'll send you recovery instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full py-3 text-sm font-semibold rounded-xl"
              >
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-forest-800 text-white mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Check your inbox</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              We've dispatched a password recovery token to <strong>{email}</strong>.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSubmitted(false)}
              className="mt-2"
            >
              Resend Link
            </Button>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-forest-800 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
