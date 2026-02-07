import React, { useState } from 'react';
import type { User } from '../../App';
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
    <div className="flex h-screen bg-medical-background overflow-hidden relative font-sans">
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-medical-background">
        {/* Topbar Mobile */}
        {/* Topbar Mobile */}
        <header className="lg:hidden bg-medical-background px-6 py-4 flex items-center justify-between shrink-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-400 hover:text-brand-blue-600 transition-all rounded-2xl hover:bg-white hover:shadow-sm"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="bg-brand-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-brand-blue-200">
              <StethoscopeIcon className="h-5 w-5" />
            </div>
            <span className="font-bold text-gray-900 text-base tracking-tight">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue-600 to-brand-blue-500 text-white flex items-center justify-center font-bold text-sm shadow-xl ring-2 ring-white">
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
