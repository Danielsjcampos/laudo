import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'teal';
  subtitle?: string;
}

const accentColors = {
  blue: '#0284c7',
  yellow: '#f59e0b',
  green: '#10b981',
  red: '#ef4444',
  teal: '#00e5c6',
};

const iconBgColors = {
  blue: 'rgba(2, 132, 199, 0.08)',
  yellow: 'rgba(245, 158, 11, 0.08)',
  green: 'rgba(16, 185, 129, 0.08)',
  red: 'rgba(239, 68, 68, 0.08)',
  teal: 'rgba(0, 229, 198, 0.08)',
};

export const Card: React.FC<CardProps> = ({ title, value, icon, color = 'blue', subtitle }) => {
  return (
    <div
      className="relative overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--surface-border)',
        padding: '1.5rem',
      }}
    >
      {/* Left accent line */}
      <div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full"
        style={{ backgroundColor: accentColors[color] }}
      />

      <div className="flex items-start justify-between">
        <div className="pl-3">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBgColors[color], color: accentColors[color] }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
