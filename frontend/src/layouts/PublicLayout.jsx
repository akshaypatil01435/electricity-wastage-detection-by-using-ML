import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles, ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../utils/constants';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Features', path: '/features' },
    { name: 'ML Detection', path: '/ml-detection' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Banner Notice */}
      <div className="bg-forest-900 text-emerald-100 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>100% Software-Based Energy Intelligence Platform · Powered by Digital Machine Learning</span>
        <Link to="/simulator" className="underline font-semibold ml-1 text-white hover:text-emerald-200">
          Try Simulator →
        </Link>
      </div>

      {/* Main Navbar matching screenshot style */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" showTagline={false} />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-forest-800 dark:text-emerald-400 font-bold'
                    : 'text-slate-600 hover:text-forest-800 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions & Login */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" variant="primary" icon={ArrowRight} iconPosition="right">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  {/* Styled solid green Login button matching screenshot */}
                  <Button size="sm" variant="primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="secondary">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-forest-800 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="primary">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="secondary">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 space-y-3">
              <Logo size="md" className="text-white" to="/" />
              <p className="text-slate-400 leading-relaxed text-xs">
                {APP_CONFIG.subtitle}. An intelligent software platform analyzing digital consumption to detect wastage in real-time.
              </p>
              <div className="pt-2 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                {APP_CONFIG.tagline}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
                <li><Link to="/features" className="hover:text-emerald-400 transition-colors">Core Features</Link></li>
                <li><Link to="/ml-detection" className="hover:text-emerald-400 transition-colors">ML Anomaly Engine</Link></li>
                <li><Link to="/simulator" className="hover:text-emerald-400 transition-colors">Digital Simulator</Link></li>
                <li><Link to="/ml-demo" className="hover:text-emerald-400 transition-colors">Try ML Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Application</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">User Portal</Link></li>
                <li><Link to="/admin" className="hover:text-emerald-400 transition-colors">Admin Console</Link></li>
                <li><Link to="/presentation" className="hover:text-emerald-400 transition-colors">Viva Presentation Mode</Link></li>
                <li><Link to="/about" className="hover:text-emerald-400 transition-colors">Project Architecture</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact / Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3">Software Architecture</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Built strictly with digital & simulated electricity feeds. Pre-configured for Spring Boot, JWT, and MySQL backend services.
              </p>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] text-slate-300">
                <span className="text-emerald-400 font-bold">100% Software Based</span> · No hardware or IoT sensor installation needed.
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
            <div>
              © {new Date().getFullYear()} {APP_CONFIG.name}. Final Year Engineering Capstone Project.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:text-slate-300">System Architecture</Link>
              <span>·</span>
              <Link to="/features" className="hover:text-slate-300">Explainable AI</Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-slate-300">Viva Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
