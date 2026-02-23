
import React from 'react';
import type { User, UserRole } from '../../types/auth';
import { StethoscopeIcon } from '../icons/StethoscopeIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { BrainIcon } from '../icons/BrainIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { ClinicIcon } from '../icons/ClinicIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { XIcon } from '../icons/XIcon';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  currentView: string;
  isOpen: boolean;
  onClose: () => void;
}

const navLinks: Record<UserRole, { view: string; label: string; icon: React.ReactNode }[]> = {
  admin: [
    { view: 'overview', label: 'Painel Global', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'ai_lab', label: 'Laboratório IA', icon: <SparklesIcon className="h-5 w-5" /> },
    { view: 'clinics', label: 'Clínicas', icon: <ClinicIcon className="h-5 w-5" /> },
    { view: 'doctors_db', label: 'Médicos', icon: <UsersIcon className="h-5 w-5" /> },
    { view: 'system_financial', label: 'Financeiro Total', icon: <WalletIcon className="h-5 w-5" /> },
    { view: 'settings', label: 'Configurações', icon: <SettingsIcon className="h-5 w-5" /> },
  ],
  clinic: [
    { view: 'overview', label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'exams', label: 'Exames', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'patients', label: 'Pacientes', icon: <UsersIcon className="h-5 w-5" /> },
    { view: 'chat', label: 'Mensagens / Chat', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { view: 'financial', label: 'Financeiro', icon: <WalletIcon className="h-5 w-5" /> },
    { view: 'doctors_contact', label: 'Médicos / Chat', icon: <StethoscopeIcon className="h-5 w-5" /> },
    { view: 'admin_support', label: 'Suporte ADM', icon: <SparklesIcon className="h-5 w-5" /> },
  ],
  doctor: [
    { view: 'overview', label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'marketplace', label: 'Marketplace', icon: <SparklesIcon className="h-5 w-5" /> },
    { view: 'ai_consult', label: 'Consultório IA', icon: <BrainIcon className="h-5 w-5" /> },
    { view: 'chat', label: 'Chat / Mensagens', icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { view: 'pending_exams', label: 'Meus Laudos', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'history', label: 'Laudos Realizados', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'financial', label: 'Meus Ganhos', icon: <WalletIcon className="h-5 w-5" /> },
  ],
  patient: [
    { view: 'overview', label: 'Tela Inicial', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'completed_exams', label: 'Exames Laudados', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'pending_exams', label: 'Exames Pendentes', icon: <ClockIcon className="h-5 w-5" /> },
    { view: 'scheduled_exams', label: 'Exames Agendados', icon: <ClinicIcon className="h-5 w-5" /> },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onNavigate, currentView, isOpen, onClose }) => {
  const links = navLinks[user.role];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col shrink-0 font-sans
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: 'var(--navy-800)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button onClick={() => handleNavigate('overview')} className="flex items-center space-x-2.5 group">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--teal-500)' }}>
              <StethoscopeIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: '#ffffff' }}>
              Laudo<span style={{ color: 'var(--teal-500)' }}>Digital</span>
            </span>
          </button>
          <button onClick={onClose} className="lg:hidden ml-auto p-2" style={{ color: 'var(--text-on-dark-muted)' }}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <div className="px-3 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-on-dark-muted)' }}>
              Menu Principal
            </p>
          </div>
          {links.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavigate(link.view)}
                className="w-full flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-all duration-200 group relative"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-on-dark-muted)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-on-dark-muted)';
                  }
                }}
              >
                {/* Teal active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ backgroundColor: 'var(--teal-500)' }}
                  />
                )}
                <span className="mr-3 transition-colors" style={{ color: isActive ? 'var(--teal-500)' : 'inherit' }}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => handleNavigate('profile')}
            className="w-full flex items-center p-2.5 rounded-xl transition-all cursor-pointer text-left"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            title="Ir para Conta/Perfil"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: 'var(--teal-500)', color: 'var(--navy-900)' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="font-bold text-[13px] truncate" style={{ color: '#ffffff' }}>{user.name}</p>
              <div className="flex items-center mt-0.5">
                <div className="status-dot status-dot--active mr-1.5" style={{ width: '6px', height: '6px' }} />
                <p className="text-[10px] truncate capitalize" style={{ color: 'var(--text-on-dark-muted)' }}>
                  {user.role === 'clinic' ? 'Instituição' : user.role === 'doctor' ? 'Médico' : user.role === 'patient' ? 'Paciente' : user.role}
                </p>
              </div>
            </div>
          </button>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <button
              onClick={() => handleNavigate('settings')}
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all"
              style={{ color: 'var(--text-on-dark-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-500)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-on-dark-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <SettingsIcon className="h-4 w-4 mb-0.5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Config</span>
            </button>
            <button
              onClick={onLogout}
              className="flex flex-col items-center justify-center p-2 rounded-lg transition-all"
              style={{ color: 'var(--text-on-dark-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-on-dark-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <LogoutIcon className="h-4 w-4 mb-0.5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
