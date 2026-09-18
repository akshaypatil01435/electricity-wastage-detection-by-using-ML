import api from './api';
import { MOCK_USERS, DEMO_CREDENTIALS } from '../mock/users';
import { USER_ROLES } from '../utils/constants';

export const authService = {
  login: async (email, password) => {
    // In production: return api.post('/auth/login', { email, password });
    await new Promise((res) => setTimeout(res, 400)); // Simulate realistic network delay

    // Check against demo credentials
    if (email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password) {
      const user = MOCK_USERS.find(u => u.role === USER_ROLES.ADMIN);
      const token = 'mock_jwt_admin_token_' + Date.now();
      localStorage.setItem('wattvision_jwt_token', token);
      localStorage.setItem('wattvision_user', JSON.stringify(user));
      return { user, token };
    }

    if (email === DEMO_CREDENTIALS.user.email && password === DEMO_CREDENTIALS.user.password) {
      const user = MOCK_USERS.find(u => u.role === USER_ROLES.USER);
      const token = 'mock_jwt_user_token_' + Date.now();
      localStorage.setItem('wattvision_jwt_token', token);
      localStorage.setItem('wattvision_user', JSON.stringify(user));
      return { user, token };
    }

    // Check other mock users or general valid simulation
    const existing = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing && (password.length >= 6)) {
      const token = 'mock_jwt_user_token_' + Date.now();
      localStorage.setItem('wattvision_jwt_token', token);
      localStorage.setItem('wattvision_user', JSON.stringify(existing));
      return { user: existing, token };
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Allow testing any email/password with user role
    const newUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: USER_ROLES.USER,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      monthlyGoalKWh: 450,
      electricityTariff: 7.50,
      totalConsumptionAnalyzed: 280.0,
      wastageEventsCount: 3,
      lastActive: "Just now"
    };

    const token = 'mock_jwt_user_token_' + Date.now();
    localStorage.setItem('wattvision_jwt_token', token);
    localStorage.setItem('wattvision_user', JSON.stringify(newUser));
    return { user: newUser, token };
  },

  register: async (name, email, password) => {
    // In production: return api.post('/auth/register', { name, email, password });
    await new Promise((res) => setTimeout(res, 500));

    if (!name || !email || !password) {
      throw new Error('All fields are required.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: USER_ROLES.USER, // Regular registration is strictly USER role
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      status: "Active",
      monthlyGoalKWh: 400,
      electricityTariff: 7.50,
      totalConsumptionAnalyzed: 0.0,
      wastageEventsCount: 0,
      lastActive: "Just now"
    };

    const token = 'mock_jwt_user_token_' + Date.now();
    localStorage.setItem('wattvision_jwt_token', token);
    localStorage.setItem('wattvision_user', JSON.stringify(newUser));
    return { user: newUser, token };
  },

  getCurrentUser: () => {
    const raw = localStorage.getItem('wattvision_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout: async () => {
    // In production: return api.post('/auth/logout');
    localStorage.removeItem('wattvision_jwt_token');
    localStorage.removeItem('wattvision_user');
    return true;
  }
};
