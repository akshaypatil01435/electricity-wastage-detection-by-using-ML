import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { USER_ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial user in localStorage or default to demo user for frictionless experience
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Default to demo user in demo mode
      const defaultDemoUser = {
        id: "usr_001",
        name: "Akshay Patil",
        email: "demo@wattguard.io",
        role: USER_ROLES.USER,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        phone: "+91 98765 43210",
        accountCreated: "2026-01-10",
        status: "Active",
        monthlyGoalKWh: 450,
        electricityTariff: 7.50,
        totalConsumptionAnalyzed: 412.5,
        wastageEventsCount: 8,
        lastActive: "Just now"
      };
      setUser(defaultDemoUser);
      localStorage.setItem('wattvision_user', JSON.stringify(defaultDemoUser));
      localStorage.setItem('wattvision_jwt_token', 'mock_jwt_demo_token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRole = (targetRole) => {
    if (targetRole === USER_ROLES.ADMIN) {
      const adminUser = {
        id: "adm_001",
        name: "System Administrator",
        email: "admin@wattguard.io",
        role: USER_ROLES.ADMIN,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        phone: "+91 99887 76655",
        accountCreated: "2025-11-01",
        status: "Active",
        monthlyGoalKWh: 500,
        electricityTariff: 7.50,
        totalConsumptionAnalyzed: 48921,
        wastageEventsCount: 3428,
        lastActive: "Just now"
      };
      setUser(adminUser);
      localStorage.setItem('wattvision_user', JSON.stringify(adminUser));
    } else {
      const regularUser = {
        id: "usr_001",
        name: "Akshay Patil",
        email: "demo@wattguard.io",
        role: USER_ROLES.USER,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        phone: "+91 98765 43210",
        accountCreated: "2026-01-10",
        status: "Active",
        monthlyGoalKWh: 450,
        electricityTariff: 7.50,
        totalConsumptionAnalyzed: 412.5,
        wastageEventsCount: 8,
        lastActive: "Just now"
      };
      setUser(regularUser);
      localStorage.setItem('wattvision_user', JSON.stringify(regularUser));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === USER_ROLES.ADMIN,
    login,
    register,
    logout,
    switchRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
