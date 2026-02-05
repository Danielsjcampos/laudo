

import React, { useState } from 'react';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { ClinicIcon } from '../components/icons/ClinicIcon';
import { DoctorIcon } from '../components/icons/DoctorIcon';
import { PatientIcon } from '../components/icons/PatientIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import type { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToLanding }) => {
  const [hoveredRole, setHoveredRole] = useState<UserRole | null>(null);

  const roles = [
    { 
        id: 'doctor' as UserRole, 
        label: 'Médico Radiologista', 
        desc: 'Acesse sua estação de laudos e worklist.',
        icon: DoctorIcon, 
        color: 'bg-brand-teal-500', 
        hoverColor: 'group-hover:text-brand-teal-500',
        borderColor: 'hover:border-brand-teal-500' 
    },
    { 
        id: 'clinic' as UserRole, 
        label: 'Gestor de Clínica', 
        desc: 'Gerencie exames, faturamento e equipe.',
        icon: ClinicIcon, 
        color: 'bg-brand-blue-600', 
        hoverColor: 'group-hover:text-brand-blue-600',
        borderColor: 'hover:border-brand-blue-600'
    },
    { 
        id: 'patient' as UserRole, 
        label: 'Paciente', 
        desc: 'Consulte histórico e baixe seus resultados.',
        icon: PatientIcon, 
        color: 'bg-indigo-500', 
        hoverColor: 'group-hover:text-indigo-500',
        borderColor: 'hover:border-indigo-500'
    },
    { 
        id: 'admin' as UserRole, 
        label: 'SysAdmin', 
        desc: 'Painel de controle e configurações globais.',
        icon: SettingsIcon, 
        color: 'bg-gray-800', 
        hoverColor: 'group-hover:text-gray-800',
        borderColor: 'hover:border-gray-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-900 via-gray-900 to-black z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay z-0"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-teal-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>

        <div className="relative z-20 flex flex-col justify-between p-16 h-full text-white">
          <div className="cursor-pointer" onClick={onNavigateToLanding}>
            <div className="flex items-center space-x-3 mb-6">
                 <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                    <StethoscopeIcon className="h-8 w-8 text-brand-teal-400" />
                 </div>
                 <span className="text-2xl font-bold tracking-tight">LaudoDigital<span className="text-brand-teal-400">.AI</span></span>
            </div>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Excelência Diagnóstica com <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-400 to-brand-blue-400">Inteligência</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Plataforma unificada para radiologistas, clínicas e pacientes. Otimize seu fluxo de trabalho com nossa IA de segunda geração.
            </p>
            <div className="flex space-x-4 pt-4">
                {['HIPAA Compliant', 'Zero Footprint', 'AI-Powered'].map((tag) => (
                    <div key={tag} className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <CheckCircleIcon className="w-3 h-3 mr-1.5 text-brand-teal-500" />
                        {tag}
                    </div>
                ))}
            </div>
          </div>

          <div className="text-xs text-gray-600 font-medium">
            © 2024 LaudoDigital Health Tech. All rights reserved.
          </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 animate-in slide-in-from-right-4 duration-700">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <div onClick={onNavigateToLanding} className="lg:hidden inline-flex items-center space-x-2 mb-8 mx-auto cursor-pointer">
                    <StethoscopeIcon className="h-8 w-8 text-brand-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">LaudoDigital</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
                <p className="text-gray-500 mt-2">Escolha seu perfil de acesso para entrar no sistema.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => onLogin(role.id)}
                        onMouseEnter={() => setHoveredRole(role.id)}
                        onMouseLeave={() => setHoveredRole(null)}
                        className={`group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 text-left outline-none focus:ring-4 focus:ring-brand-blue-100 ${hoveredRole === role.id ? 'border-transparent shadow-xl scale-[1.02]' : 'border-gray-100 bg-white shadow-sm'}`}
                    >
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 ${role.borderColor}`} />
                        
                        <div className={`flex-shrink-0 p-4 rounded-xl ${role.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <role.icon className="h-6 w-6" />
                        </div>
                        
                        <div className="ml-5">
                            <h3 className={`text-base font-bold text-gray-900 transition-colors duration-300 ${role.hoverColor}`}>
                                {role.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 font-medium">
                                {role.desc}
                            </p>
                        </div>
                        
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                            <svg className={`w-5 h-5 ${role.id === 'doctor' ? 'text-brand-teal-500' : role.id === 'clinic' ? 'text-brand-blue-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-6 text-center text-sm text-gray-400 font-medium">
                Protegido por criptografia end-to-end. <br />
                Ao entrar, você concorda com nossos <a className="text-brand-blue-600 hover:text-brand-blue-700 underline cursor-pointer">Termos de Uso</a>.
            </div>

            {/* Dev Quick Access Section */}
            <div className="mt-12 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Ambiente de Desenvolvimento</span>
                    <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal-500 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-teal-500/50"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => onLogin('admin')}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        <SettingsIcon className="w-4 h-4 text-brand-teal-400" />
                        <span>Dev Admin</span>
                    </button>
                    <button 
                        onClick={() => onLogin('doctor')}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-teal-500 hover:bg-brand-teal-600 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        <DoctorIcon className="w-4 h-4" />
                        <span>Dev Doctor</span>
                    </button>
                    <button 
                        onClick={() => onLogin('clinic')}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        <ClinicIcon className="w-4 h-4" />
                        <span>Dev Clinic</span>
                    </button>
                    <button 
                        onClick={() => onLogin('patient')}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                        <PatientIcon className="w-4 h-4" />
                        <span>Dev Patient</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
