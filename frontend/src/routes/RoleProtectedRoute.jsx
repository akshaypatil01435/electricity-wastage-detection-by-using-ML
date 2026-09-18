import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const RoleProtectedRoute = ({ children, requiredRole = USER_ROLES.ADMIN }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <LoadingSkeleton rows={5} className="max-w-md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== requiredRole) {
    // Normal user attempting to access /admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
