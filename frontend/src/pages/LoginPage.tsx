
import React, { useState } from 'react';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { ClinicIcon } from '../components/icons/ClinicIcon';
import { DoctorIcon } from '../components/icons/DoctorIcon';
import { PatientIcon } from '../components/icons/PatientIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import type { UserRole } from '../types/auth';

interface LoginPageProps {
  onLogin: (role: any) => void;
  onManualLogin: (email: string, password: string) => void;
  onNavigateToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onManualLogin, onNavigateToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await onManualLogin(email, password);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 animate-in slide-in-from-right-4 duration-700 bg-white">
        <div className="w-full max-w-sm space-y-8">
            <div className="text-center lg:text-left">
                <div onClick={onNavigateToLanding} className="lg:hidden inline-flex items-center space-x-2 mb-8 mx-auto cursor-pointer">
                    <StethoscopeIcon className="h-8 w-8 text-brand-blue-600" />
                    <span className="text-2xl font-bold text-gray-900">LaudoDigital</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo de volta</h2>
                <p className="text-gray-500 mt-2 font-medium text-sm">Acesse sua conta para continuar gerenciando seus diagnósticos.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1" htmlFor="email">E-mail Profissional</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            required
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 outline-none transition-all placeholder:text-gray-400"
                            placeholder="exemplo@laudodigital.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1" htmlFor="password">Senha</label>
                        <button type="button" className="text-xs font-bold text-brand-blue-600 hover:text-brand-blue-700 transition-colors">Esqueceu a senha?</button>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-blue-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 outline-none transition-all placeholder:text-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center ml-1">
                    <input id="remember" type="checkbox" className="w-4 h-4 text-brand-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-blue-500 focus:ring-2" />
                    <label htmlFor="remember" className="ml-2 text-xs font-medium text-gray-500">Manter conectado</label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-lg shadow-brand-blue-600/20 text-sm font-bold text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-4 focus:ring-brand-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                    {isLoading ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Entrar no Sistema'}
                </button>
            </form>

            <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.2em]"><span className="bg-white px-4 text-gray-300">Ambiente de Desenvolvimento</span></div>
            </div>

            {/* Dev Quick Access Section */}
            <div className="grid grid-cols-2 gap-3 transition-all duration-500">
                <button 
                    onClick={() => onLogin('admin')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <SettingsIcon className="w-4 h-4 text-brand-teal-400" />
                    <span>Dev Admin</span>
                </button>
                <button 
                    onClick={() => onLogin('doctor')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-brand-teal-500 hover:bg-brand-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <DoctorIcon className="w-4 h-4" />
                    <span>Dev Roberto</span>
                </button>
                <button 
                    onClick={() => onLogin('doctor_ana')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-brand-teal-600 hover:bg-brand-teal-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <DoctorIcon className="w-4 h-4" />
                    <span>Dev Dra. Ana</span>
                </button>
                <button 
                    onClick={() => onLogin('clinic')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <ClinicIcon className="w-4 h-4" />
                    <span>Dev Clinic</span>
                </button>
                <button 
                    onClick={() => onLogin('patient')}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                    <PatientIcon className="w-4 h-4" />
                    <span>Dev Patient</span>
                </button>
            </div>

            <div className="pt-4 text-center text-[10px] text-gray-400 font-medium leading-relaxed">
                Protegido por criptografia industrial AES-256 e SSL de 2048-bit. <br />
                Ao entrar, você concorda com nossos <button type="button" className="text-brand-blue-600 hover:underline">Termos de Serviço</button>.
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
