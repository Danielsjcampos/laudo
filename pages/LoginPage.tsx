
import React from 'react';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { ClinicIcon } from '../components/icons/ClinicIcon';
import { DoctorIcon } from '../components/icons/DoctorIcon';
import { PatientIcon } from '../components/icons/PatientIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import type { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  onNavigateToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToLanding }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
          <button onClick={onNavigateToLanding} className="flex items-center space-x-2 mx-auto">
            <StethoscopeIcon className="h-10 w-10 text-brand-blue-600" />
            <span className="text-3xl font-bold text-gray-800">Laudo<span className="text-brand-blue-600">Digital</span></span>
          </button>
          <p className="text-gray-600 mt-2">Acesse seu painel para continuar</p>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Selecione seu Perfil</h2>
        
        <div className="grid grid-cols-1 gap-4">
            <button
                onClick={() => onLogin('admin')}
                className="w-full flex items-center justify-center bg-gray-800 text-white px-6 py-4 rounded-lg shadow-md hover:bg-black transition-all duration-300 font-bold"
            >
                <SettingsIcon className="h-6 w-6 mr-3" />
                Operador do Sistema (Admin)
            </button>
            <div className="border-t my-2"></div>
            <button
                onClick={() => onLogin('clinic')}
                className="w-full flex items-center justify-center bg-brand-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-brand-blue-700 transition-all duration-300 font-semibold"
            >
                <ClinicIcon className="h-6 w-6 mr-3" />
                Acesso Clínica
            </button>
            <button
                onClick={() => onLogin('doctor')}
                className="w-full flex items-center justify-center bg-brand-teal-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-brand-teal-700 transition-all duration-300 font-semibold"
            >
                <DoctorIcon className="h-6 w-6 mr-3" />
                Acesso Médico
            </button>
            <button
                onClick={() => onLogin('patient')}
                className="w-full flex items-center justify-center bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 font-semibold"
            >
                <PatientIcon className="h-6 w-6 mr-3" />
                Acesso Paciente
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
