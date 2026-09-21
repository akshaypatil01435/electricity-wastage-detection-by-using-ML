import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

const TestAuthConsumer = () => {
  const { user, isAuthenticated, isDemoMode, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</span>
      <span data-testid="user-role">{user ? user.role : 'GUEST'}</span>
      <span data-testid="demo-state">{isDemoMode ? 'DEMO' : 'LIVE'}</span>
      <button data-testid="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext and Public Pages Suite', () => {
  it('provides authenticated demo state by default in demo mode', () => {
    localStorage.clear();
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('auth-state')).toHaveTextContent('LOGGED_IN');
    expect(screen.getByTestId('user-role')).toHaveTextContent('ROLE_USER');
  });

  it('renders LandingPage successfully', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <LandingPage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getAllByText(/WattVision/i).length).toBeGreaterThan(0);
  });

  it('renders LoginPage with login credentials form and demo hints', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <LoginPage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
  });

  it('renders RegisterPage successfully', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <ToastProvider>
            <RegisterPage />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /^create account$/i })).toBeInTheDocument();
  });

  it('renders NotFoundPage on unmatched routes', () => {
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
