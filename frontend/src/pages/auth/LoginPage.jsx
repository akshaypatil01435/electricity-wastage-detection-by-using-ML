import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import Logo from '../../components/common/Logo';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_CREDENTIALS } from '../../mock/users';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email || DEMO_CREDENTIALS.user.email, password || DEMO_CREDENTIALS.user.password);
      toastSuccess(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      toastError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type) => {
    if (type === 'admin') {
      setEmail(DEMO_CREDENTIALS.admin.email);
      setPassword(DEMO_CREDENTIALS.admin.password);
    } else {
      setEmail(DEMO_CREDENTIALS.user.email);
      setPassword(DEMO_CREDENTIALS.user.password);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Logo header matching screenshot */}
        <div className="flex justify-start">
          <Logo size="md" showTagline={false} />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign in to your WattGuard account
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Form */}
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-forest-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-forest-800 focus:ring-forest-700 border-slate-300 dark:border-slate-700"
              />
              <span>Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-semibold text-forest-800 dark:text-emerald-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button matching screenshot */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full py-3 text-sm font-semibold rounded-xl"
          >
            Sign in
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-forest-800 dark:text-emerald-400 hover:underline">
            Register
          </Link>
        </div>

        {/* Demo Credentials Box matching screenshot media_1787464792995.jpg */}
        <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-forest-900 dark:text-emerald-300">Demo credentials</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fillCredentials('user')}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-white dark:bg-slate-800 text-forest-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100"
              >
                Fill User
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="px-2 py-0.5 rounded text-[11px] font-bold bg-white dark:bg-slate-800 text-forest-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100"
              >
                Fill Admin
              </button>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Email: <code className="font-mono text-forest-800 dark:text-emerald-400">demo@wattguard.io</code> · Password: <code className="font-mono text-forest-800 dark:text-emerald-400">demo123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
