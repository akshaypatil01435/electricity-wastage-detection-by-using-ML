import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Logo from '../components/common/Logo';
import { Zap, AlertTriangle } from 'lucide-react';

describe('Frontend Common Components', () => {
  it('renders Logo with WattVision brand name', () => {
    render(
      <MemoryRouter>
        <Logo />
      </MemoryRouter>
    );
    expect(screen.getByText(/WattVision/i)).toBeInTheDocument();
  });

  it('renders StatCard with title, value, and change', () => {
    render(
      <StatCard
        title="Total Consumption"
        value="412.5 kWh"
        change="-4.2% vs last month"
        changeType="positive"
        icon={Zap}
      />
    );
    expect(screen.getByText('Total Consumption')).toBeInTheDocument();
    expect(screen.getByText('412.5 kWh')).toBeInTheDocument();
    expect(screen.getByText('-4.2% vs last month')).toBeInTheDocument();
  });

  it('renders StatusBadge with correct variant styling text', () => {
    const { rerender } = render(<StatusBadge status="Resolved" />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();

    rerender(<StatusBadge status="CRITICAL" />);
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
  });

  it('renders Button with text and handles loading state', () => {
    const { rerender } = render(<Button variant="primary">Click Me</Button>);
    expect(screen.getByRole('button', { name: /Click Me/i })).toBeInTheDocument();

    rerender(<Button loading>Click Me</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('renders EmptyState with title and message', () => {
    render(
      <EmptyState
        title="No Anomalies Found"
        description="All digital power metrics are running within nominal boundaries."
        icon={AlertTriangle}
      />
    );
    expect(screen.getByText('No Anomalies Found')).toBeInTheDocument();
    expect(screen.getByText(/All digital power metrics/i)).toBeInTheDocument();
  });
});
