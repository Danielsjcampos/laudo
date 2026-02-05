
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
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-medical-border shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shrink-0 font-sans
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-medical-border">
          <button onClick={() => handleNavigate('overview')} className="flex items-center space-x-2 group">
            <div className="bg-brand-blue-600 p-2 rounded-lg text-white group-hover:bg-brand-blue-700 transition-colors">
                <StethoscopeIcon className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </button>
          <button onClick={onClose} className="lg:hidden ml-auto p-2 text-gray-400 hover:text-gray-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-2 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu Principal</p>
          </div>
          {links.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavigate(link.view)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative ${
                  (currentView === link.view)
                  ? 'bg-brand-blue-50 text-brand-blue-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${(currentView === link.view) ? 'text-brand-blue-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors mr-3`}>
                {link.icon}
              </div>
              <span>{link.label}</span>
              {(currentView === link.view) && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-blue-600 rounded-l-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-medical-border bg-gray-50/30">
          <div className="flex items-center p-3 mb-2 rounded-xl border border-transparent hover:border-medical-border hover:bg-white transition-all cursor-default">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue-600 to-brand-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                  {user.name.charAt(0)}
              </div>
              <div className="ml-3 overflow-hidden">
                  <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                  <div className="flex items-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                      <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
                  </div>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={() => handleNavigate('settings')} className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-brand-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-gray-100">
                <SettingsIcon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">Config</span>
            </button>
            <button
                onClick={onLogout}
                className="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-red-50"
            >
                <LogoutIcon className="h-5 w-5 mb-1" />
                <span className="text-[10px] font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
