import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { mockDoctors, mockExams, mockPatients, mockPatientCarlaExams } from './data/mockData';
import type { Doctor, Exam, Patient, ExamModality, ExamUrgency } from './data/mockData';
import { ToastProvider } from './contexts/ToastContext';
import { authService, User as AuthUser } from './services/authService';
import api from './lib/api';

export type UserRole = 'admin' | 'clinic' | 'doctor' | 'patient';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<any>(null);

  const fetchData = async () => {
    try {
      // Usando allSettled para não travar o dashboard se uma rota falhar
      const [examsRes, patientsRes, statsRes] = await Promise.allSettled([
        api.get('/exams'),
        api.get('/patients'),
        api.get('/stats')
      ]);
      
      if (examsRes.status === 'fulfilled') setExams(examsRes.value.data);
      if (patientsRes.status === 'fulfilled') setPatients(patientsRes.value.data);
      if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data);
      } else {
          // Fallback se stats falhar but others work
          console.warn('Estatísticas indisponíveis, usando fallback');
          setStats({ activeClinics: 0, totalDoctors: 0, totalExamsProcessed: 0, totalRevenue: 0, platformProfit: 0, totalTransferred: 0 });
      }
    } catch (err) {
      console.error('Erro crítico ao buscar dados:', err);
    }
  };

  // Check auth on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await authService.getMe();
        setUser(user);
        setView('dashboard');
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch data when user logs in
  React.useEffect(() => {
    if (user && view === 'dashboard') {
      fetchData();
    }
  }, [user, view]);

  const handleLogin = async (role: UserRole) => {
    // Quick Dev Access Mapper
    const devCredentials = {
        admin: { email: 'admin@laudodigital.com', password: 'admin123' },
        clinic: { email: 'contato@saudeplena.com', password: 'password' },
        doctor: { email: 'roberto.martins@doc.com', password: 'password' },
        patient: { email: 'carla.f@email.com', password: 'password' },
    };

    try {
        const { email, password } = devCredentials[role];
        const data = await authService.login(email, password);
        setUser(data.user);
        setView('dashboard');
    } catch (err) {
        alert('Erro ao realizar login dev');
    }
  };

  const handleManualLogin = async (email: string, password: string) => {
    try {
        const data = await authService.login(email, password);
        setUser(data.user);
        setView('dashboard');
    } catch (err: any) {
        alert(err.response?.data?.error || 'Erro ao realizar login');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setExams([]);
    setPatients([]);
    setView('landing');
  };

  const navigateToLogin = () => setView('login');
  const navigateToLanding = () => setView('landing');

  const handleRequestExam = async (
    patientId: string, 
    examType: string, 
    specialty: string, 
    price: number,
    modality: ExamModality = 'OT',
    urgency: ExamUrgency = 'Rotina',
    bodyPart: string = 'Não especificado',
    file: File | null = null
  ) => {
    try {
      const formData = new FormData();
      formData.append('patientId', patientId);
      formData.append('examType', examType);
      formData.append('specialtyRequired', specialty);
      formData.append('price', price.toString());
      formData.append('modality', modality);
      formData.append('urgency', urgency);
      formData.append('bodyPart', bodyPart);
      if (file) {
        formData.append('dicom', file);
      }

      await api.post('/exams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchData();
    } catch (err) {
      console.error('Erro ao solicitar exame:', err);
      alert('Erro ao solicitar exame');
    }
  };

  const handleAcceptExam = async (examId: string) => {
    try {
      await api.post(`/exams/${examId}/accept`);
      fetchData();
    } catch (err) {
      alert('Erro ao aceitar exame');
    }
  };

  const handleCompleteReport = async (examId: string, finalReport: string) => {
    try {
      await api.post(`/exams/${examId}/complete`, { finalReport });
      fetchData();
    } catch (err) {
      alert('Erro ao concluir laudo');
    }
  };

  const handleRegisterPatient = async (name: string, cpf: string, email: string) => {
    try {
      await api.post('/patients', { name, cpf, email });
      fetchData();
    } catch (err) {
      alert('Erro ao registrar paciente');
    }
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onManualLogin={handleManualLogin} onNavigateToLanding={navigateToLanding} />;
      case 'dashboard':
        return user && <DashboardPage 
                          user={user} 
                          onLogout={handleLogout}
                          patients={patients}
                          doctors={doctors}
                          exams={exams}
                          stats={stats}
                          onRequestExam={handleRequestExam}
                          onAcceptExam={handleAcceptExam}
                          onCompleteReport={handleCompleteReport}
                          onRegisterPatient={handleRegisterPatient}
                       />;
      case 'landing':
      default:
        return <LandingPage onNavigateToLogin={navigateToLogin} />;
    }
  };

  return (
    <ToastProvider>
        <div className="antialiased text-gray-800">{renderView()}</div>
    </ToastProvider>
  );
};

export default App;
