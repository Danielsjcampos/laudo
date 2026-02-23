import React, { useState } from 'react';
import { User } from '../../types/auth';
import Sidebar from '../dashboard/Sidebar';
import { MenuIcon } from '../icons/MenuIcon';
import { StethoscopeIcon } from '../icons/StethoscopeIcon';

interface DashboardLayoutProps {
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  currentView,
  onNavigate,
  onLogout,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden relative font-sans" style={{ backgroundColor: 'var(--surface-bg)' }}>
      {currentView !== 'ohif_viewer' && (
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
        {/* Topbar Mobile — dark navy */}
        <header
          className="lg:hidden px-4 py-3 flex items-center justify-between shrink-0 z-10"
          style={{ backgroundColor: 'var(--navy-800)' }}
        >
          {currentView !== 'ohif_viewer' && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-1 transition-all rounded-lg"
              style={{ color: 'var(--text-on-dark-muted)' }}
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

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none custom-scrollbar">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
