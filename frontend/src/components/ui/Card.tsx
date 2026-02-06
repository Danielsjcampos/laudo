import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'yellow' | 'green' | 'red';
}

const colorClasses = {
  blue: 'bg-brand-blue-100 text-brand-blue-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  red: 'bg-red-100 text-red-600',
};

export const Card: React.FC<CardProps> = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-full ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};
