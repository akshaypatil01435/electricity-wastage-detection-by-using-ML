import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Bell,
  FileText,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import Logo from '../components/common/Logo';
import DemoBanner from '../components/common/DemoBanner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { USER_ROLES } from '../utils/constants';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout, switchRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Overview', path: '/admin', icon: ShieldAlert },
    { name: 'Users', path: '/admin/users', icon: Users, badgeCount: '1,248' },
    { name: 'Consumption Data', path: '/admin/consumption', icon: TrendingUp },
    { name: 'Wastage Events', path: '/admin/wastage-events', icon: AlertTriangle, badge: '3,428' },
    { name: 'ML Model', path: '/admin/ml-model', icon: Cpu, badge: 'v1.0' },
    { name: 'Alerts', path: '/admin/alerts', icon: Bell },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ScrollText },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100 dark:bg-slate-950 transition-colors duration-200">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Admin Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Logo size="md" showTagline={false} to="/admin" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest-900 text-emerald-300 border border-emerald-700">
                Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              System Administration
            </span>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-forest-800 text-white shadow-sm border border-emerald-600/40'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      active ? 'bg-forest-900 text-emerald-200' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.badgeCount && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-800 text-slate-400">
                      {item.badgeCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Back to User Portal link */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-400 bg-forest-950/80 border border-emerald-800/80 hover:bg-forest-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-400 md:hidden hover:bg-slate-800"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">Enterprise AI Engine · Online</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DemoBanner />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
                  alt="Admin"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                />
                <span className="text-xs font-bold text-slate-200 hidden sm:block">Admin</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 text-xs"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{user?.name || "System Admin"}</p>
                    <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-900">
                      <span>Admin Profile</span>
                    </Link>
                    <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-900">
                      <span>System Settings</span>
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
