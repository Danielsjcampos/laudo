import React, { useState } from 'react';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';

interface HeaderProps {
    onNavigateToLogin: () => void;
}


const Header: React.FC<HeaderProps> = ({ onNavigateToLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: 'Funcionalidades' },
    { href: '#how-it-works', label: 'Como Funciona' },
    { href: '#testimonials', label: 'Depoimentos' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2">
            <StethoscopeIcon className="h-8 w-8 text-brand-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-brand-blue-600 transition-colors duration-300 font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={onNavigateToLogin} className="text-brand-blue-600 font-semibold hover:underline">Login</button>
            <button onClick={onNavigateToLogin} className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-blue-700 transition-all duration-300 transform hover:scale-105">
              Cadastre-se
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-brand-blue-600">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-600 hover:text-brand-blue-600 transition-colors duration-300 font-medium text-center py-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <button onClick={() => { onNavigateToLogin(); setIsMenuOpen(false); }} className="text-brand-blue-600 font-semibold hover:underline text-center">Login</button>
                <button onClick={() => { onNavigateToLogin(); setIsMenuOpen(false); }} className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-brand-blue-700 transition-all duration-300 text-center">
                  Cadastre-se
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
