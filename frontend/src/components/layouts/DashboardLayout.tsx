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
        <header className="lg:hidden bg-white border-b border-medical-border px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-brand-blue-600 transition-colors rounded-lg hover:bg-gray-50"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <StethoscopeIcon className="h-6 w-6 text-brand-blue-600" />
            <span className="font-bold text-gray-900 text-sm">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue-600 to-brand-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {user.name.charAt(0)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 focus:outline-none custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
