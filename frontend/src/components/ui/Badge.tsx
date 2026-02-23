import React from 'react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  status?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  success: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.2)' },
  warning: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#d97706', borderColor: 'rgba(245, 158, 11, 0.2)' },
  danger: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderColor: 'rgba(239, 68, 68, 0.2)' },
  info: { backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0284c7', borderColor: 'rgba(14, 165, 233, 0.2)' },
  default: { backgroundColor: 'rgba(107, 114, 128, 0.08)', color: '#6b7280', borderColor: 'rgba(107, 114, 128, 0.15)' },
};

const statusToVariant: Record<string, string> = {
  'Concluído': 'success',
  'Aguardando Laudo': 'warning',
  'Em Análise': 'info',
  'Em Revisão': 'info',
  'Cancelado': 'danger',
  'Disponível': 'info',
  'Ativo': 'success',
  'Inativo': 'danger',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant, status }) => {
  const resolvedVariant = variant || (status ? (statusToVariant[status] || 'default') : 'default');
  const label = children || status || '';

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
      style={variantStyles[resolvedVariant] || variantStyles.default}
    >
      {label}
    </span>
  );
};