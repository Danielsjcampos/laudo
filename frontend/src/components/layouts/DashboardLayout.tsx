import React, { useState } from 'react';
import { User, UserRole } from '../../types/auth';
import Sidebar from '../dashboard/Sidebar';
import { MenuIcon } from '../icons/MenuIcon';
import { StethoscopeIcon } from '../icons/StethoscopeIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { FileTextIcon } from '../icons/FileTextIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { WalletIcon } from '../icons/WalletIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface DashboardLayoutProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

// Bottom nav links por role (max 4 itens — thumb zone)
const bottomNavLinks: Record<UserRole, { view: string; label: string; icon: React.ReactNode }[]> = {
  admin: [
    { view: 'overview', label: 'Painel', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'clinics', label: 'Clínicas', icon: <UsersIcon className="h-5 w-5" /> },
    { view: 'system_financial', label: 'Financeiro', icon: <WalletIcon className="h-5 w-5" /> },
    { view: 'settings', label: 'Config', icon: <SparklesIcon className="h-5 w-5" /> },
  ],
  clinic: [
    { view: 'overview', label: 'Início', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'exams', label: 'Exames', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'patients', label: 'Pacientes', icon: <UsersIcon className="h-5 w-5" /> },
    { view: 'financial', label: 'Financeiro', icon: <WalletIcon className="h-5 w-5" /> },
  ],
  doctor: [
    { view: 'overview', label: 'Início', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'marketplace', label: 'Marketplace', icon: <SparklesIcon className="h-5 w-5" /> },
    { view: 'pending_exams', label: 'Laudos', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'financial', label: 'Ganhos', icon: <WalletIcon className="h-5 w-5" /> },
  ],
  patient: [
    { view: 'overview', label: 'Início', icon: <DashboardIcon className="h-5 w-5" /> },
    { view: 'completed_exams', label: 'Laudados', icon: <FileTextIcon className="h-5 w-5" /> },
    { view: 'pending_exams', label: 'Pendentes', icon: <FileTextIcon className="h-5 w-5" /> },
  ],
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isOhifViewer = currentView === 'ohif_viewer';
  const bottomLinks = bottomNavLinks[user.role] || [];

  return (
    <div className="flex h-screen overflow-hidden relative font-sans" style={{ backgroundColor: 'var(--surface-bg)' }}>
      {/* Sidebar (desktop sempre visível, mobile como drawer) */}
      {!isOhifViewer && (
        <Sidebar
          user={user}
          onLogout={onLogout}
          onNavigate={(view) => {
            onNavigate(view);
            setIsSidebarOpen(false);
          }}
          currentView={currentView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: 'var(--surface-bg)' }}>
        {/* Topbar Mobile */}
        <header
          className="lg:hidden px-4 py-3 flex items-center justify-between shrink-0 z-10"
          style={{ backgroundColor: 'var(--navy-800)' }}
        >
          {!isOhifViewer && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="btn-touch p-2 -ml-1 transition-all rounded-lg"
              style={{ color: 'var(--text-on-dark-muted)' }}
              aria-label="Abrir menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--teal-500)' }}>
              <StethoscopeIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight" style={{ color: '#ffffff' }}>
              Laudo<span style={{ color: 'var(--teal-500)' }}>Digital</span>
            </span>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: 'var(--teal-500)', color: 'var(--navy-900)' }}
          >
            {user.name.charAt(0)}
          </div>
        </header>

        {/* Main Content */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none touch-scroll"
          style={{ paddingBottom: !isOhifViewer ? 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 1rem)' : '1.5rem' }}
        >
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* BottomNav Mobile — apenas quando não está no OHIF */}
        {!isOhifViewer && (
          <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex"
            style={{
              backgroundColor: 'var(--navy-800)',
              borderColor: 'rgba(255,255,255,0.08)',
              height: 'var(--bottom-nav-height)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {bottomLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className="btn-touch flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
                  style={{ color: isActive ? 'var(--teal-500)' : 'var(--text-on-dark-muted)' }}
                  aria-label={link.label}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--teal-500)' }}
                    />
                  )}
                  <span style={{ color: isActive ? 'var(--teal-500)' : 'var(--text-on-dark-muted)' }}>
                    {link.icon}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
