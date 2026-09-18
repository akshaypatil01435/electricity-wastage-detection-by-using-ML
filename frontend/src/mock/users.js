import { USER_ROLES } from '../utils/constants';

export const MOCK_USERS = [
  {
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
  },
  {
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
  },
  {
    id: "usr_002",
    name: "Rohan Sharma",
    email: "rohan.sharma@example.com",
    role: USER_ROLES.USER,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98111 22334",
    accountCreated: "2026-02-14",
    status: "Active",
    monthlyGoalKWh: 380,
    electricityTariff: 7.50,
    totalConsumptionAnalyzed: 342.1,
    wastageEventsCount: 5,
    lastActive: "2 hours ago"
  },
  {
    id: "usr_003",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    role: USER_ROLES.USER,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+91 97222 33445",
    accountCreated: "2026-03-01",
    status: "Active",
    monthlyGoalKWh: 520,
    electricityTariff: 7.50,
    totalConsumptionAnalyzed: 512.4,
    wastageEventsCount: 14,
    lastActive: "15 minutes ago"
  },
  {
    id: "usr_004",
    name: "Arjun Verma",
    email: "arjun.v@techcorp.io",
    role: USER_ROLES.USER,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 96333 44556",
    accountCreated: "2026-03-18",
    status: "Suspended",
    monthlyGoalKWh: 600,
    electricityTariff: 7.50,
    totalConsumptionAnalyzed: 689.0,
    wastageEventsCount: 22,
    lastActive: "3 days ago"
  },
  {
    id: "usr_005",
    name: "Neha Kulkarni",
    email: "neha.k@enterprise.in",
    role: USER_ROLES.USER,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+91 95444 55667",
    accountCreated: "2026-04-05",
    status: "Active",
    monthlyGoalKWh: 400,
    electricityTariff: 7.50,
    totalConsumptionAnalyzed: 298.5,
    wastageEventsCount: 2,
    lastActive: "Yesterday"
  }
];

export const DEMO_CREDENTIALS = {
  user: {
    email: "demo@wattguard.io",
    password: "demo123",
    role: USER_ROLES.USER,
    name: "Demo User"
  },
  admin: {
    email: "admin@wattguard.io",
    password: "admin123",
    role: USER_ROLES.ADMIN,
    name: "System Administrator"
  }
};
