import React from 'react';
import type { ExamStatus } from '../../data/mockData';

interface BadgeProps {
  status: ExamStatus;
}

// Fix: Added missing 'Disponível' key to satisfy the Record<ExamStatus, string> type requirement
const statusStyles: Record<ExamStatus, string> = {
  'Concluído': 'bg-green-100 text-green-800',
  'Aguardando Laudo': 'bg-blue-100 text-blue-800',
  'Em Análise': 'bg-yellow-100 text-yellow-800',
  'Recusado': 'bg-red-100 text-red-800',
  'Disponível': 'bg-indigo-100 text-indigo-800',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};