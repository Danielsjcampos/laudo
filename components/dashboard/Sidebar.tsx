
import React from 'react';
import type { User, UserRole } from '../../App';
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
  ],
  clinic: [
    { view: 'overview', label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'exams', label: 'Exames', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'patients', label: 'Pacientes', icon: <UsersIcon className="h-5 w-5" /> },
    { view: 'financial', label: 'Financeiro', icon: <WalletIcon className="h-5 w-5" /> },
  ],
  doctor: [
    { view: 'overview', label: 'Dashboard', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'marketplace', label: 'Marketplace', icon: <SparklesIcon className="h-5 w-5" /> },
    { view: 'ai_consult', label: 'Consultório IA', icon: <BrainIcon className="h-5 w-5" /> },
    { view: 'pending_exams', label: 'Meus Laudos', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'financial', label: 'Meus Ganhos', icon: <WalletIcon className="h-5 w-5" /> },
  ],
  patient: [
    { view: 'my_exams', label: 'Meus Exames', icon: <FileTextIcon className="h-5 w-5" /> },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, onNavigate, currentView, isOpen, onClose }) => {
  const links = navLinks[user.role];

  const handleNavigate = (view: string) => {
    onNavigate(view);
    onClose(); // Fecha no mobile após clicar
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-md flex flex-col shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b flex items-center justify-between">
          <button onClick={() => handleNavigate('overview')} className="flex items-center space-x-2">
            <StethoscopeIcon className="h-8 w-8 text-brand-blue-600" />
            <span className="text-xl font-bold text-gray-800">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </button>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavigate(link.view)}
              className={`w-full flex items-center px-4 py-3 text-gray-600 rounded-xl hover:bg-brand-blue-50 hover:text-brand-blue-600 transition-all text-left ${
                  (currentView === link.view)
                  ? 'bg-brand-blue-50 text-brand-blue-600 font-bold shadow-sm' 
                  : ''
              }`}
            >
              {link.icon}
              <span className="ml-3 font-medium">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
          <div className="flex items-center mb-4 px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-brand-blue-600 text-white flex items-center justify-center font-bold text-lg mr-3 shrink-0 shadow-md">
                  {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                  <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">{user.role}</p>
              </div>
          </div>
          <button onClick={() => handleNavigate('settings')} className="w-full flex items-center px-4 py-3 text-gray-600 rounded-xl hover:bg-white hover:shadow-sm text-left transition-all">
              <SettingsIcon className="h-5 w-5" />
              <span className="ml-3 font-medium text-sm">Configurações</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center mt-1 px-4 py-3 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogoutIcon className="h-5 w-5" />
            <span className="ml-3 font-medium text-sm">Sair da Conta</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
