import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';
import { USER_ROLES } from '../utils/constants';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import AboutPage from '../pages/public/AboutPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import MLDetectionPage from '../pages/public/MLDetectionPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import ConsumptionAnalytics from '../pages/user/ConsumptionAnalytics';
import WastageDetection from '../pages/user/WastageDetection';
import ApplianceAnalysis from '../pages/user/ApplianceAnalysis';
import PredictionsPage from '../pages/user/PredictionsPage';
import RecommendationsPage from '../pages/user/RecommendationsPage';
import AlertCenter from '../pages/user/AlertCenter';
import HistoryPage from '../pages/user/HistoryPage';
import ReportsPage from '../pages/user/ReportsPage';
import SimulatorPage from '../pages/user/SimulatorPage';
import MLDemoPage from '../pages/user/MLDemoPage';
import PresentationMode from '../pages/user/PresentationMode';
import ProfilePage from '../pages/user/ProfilePage';
import SettingsPage from '../pages/user/SettingsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminConsumption from '../pages/admin/AdminConsumption';
import AdminWastageEvents from '../pages/admin/AdminWastageEvents';
import AdminMLModel from '../pages/admin/AdminMLModel';
import AdminAlerts from '../pages/admin/AdminAlerts';
import AdminReports from '../pages/admin/AdminReports';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminSettings from '../pages/admin/AdminSettings';

import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/ml-detection" element={<MLDetectionPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Authenticated User Portal */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/consumption" element={<ConsumptionAnalytics />} />
        <Route path="/wastage" element={<WastageDetection />} />
        <Route path="/appliances" element={<ApplianceAnalysis />} />
        <Route path="/predictions" element={<PredictionsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/alerts" element={<AlertCenter />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/ml-demo" element={<MLDemoPage />} />
        <Route path="/presentation" element={<PresentationMode />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Enterprise Admin Console */}
      <Route
        element={
          <RoleProtectedRoute requiredRole={USER_ROLES.ADMIN}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/consumption" element={<AdminConsumption />} />
        <Route path="/admin/wastage-events" element={<AdminWastageEvents />} />
        <Route path="/admin/ml-model" element={<AdminMLModel />} />
        <Route path="/admin/alerts" element={<AdminAlerts />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
