import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SharedExamPage from './pages/SharedExamPage';
import { mockDoctors, mockExams, mockPatients, mockPatientCarlaExams } from './data/mockData';
import type { Doctor, Exam, Patient, ExamModality, ExamUrgency } from './data/mockData';
import { ToastProvider } from './contexts/ToastContext';
import { authService } from './services/authService';
import api from './lib/api';

import { UserRole, User } from './types/auth';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard' | 'shared'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [currentActorId, setCurrentActorId] = useState<string>('');
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const fetchData = async () => {
    try {
      // Usando allSettled para não travar o dashboard se uma rota falhar
      const [examsRes, patientsRes, statsRes, doctorsRes] = await Promise.allSettled([
        api.get('/exams'),
        api.get('/patients'),
        api.get('/stats'),
        api.get('/doctors')
      ]);

      if (examsRes.status === 'fulfilled') setExams(examsRes.value.data);
      if (patientsRes.status === 'fulfilled') setPatients(patientsRes.value.data);
      if (doctorsRes.status === 'fulfilled') setDoctors(doctorsRes.value.data);
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      } else {
        // Fallback se stats falhar but others work
        console.warn('Estatísticas indisponíveis, usando fallback');
        setStats({ activeClinics: 0, totalDoctors: 0, totalExamsProcessed: 0, totalRevenue: 0, platformProfit: 0, totalTransferred: 0 });
      }

      // Fetch unread messages
      if (currentActorId) {
         try {
            const countsRes = await api.get('/messages/unread', { params: { userId: currentActorId } });
            const counts = countsRes.data;
            const total = Object.values(counts).reduce((acc: number, val: any) => acc + val, 0) as number;
            setTotalUnreadMessages(total);
         } catch(e) { /* ignore */ }
      }
    } catch (err) {
      console.error('Erro crítico ao buscar dados:', err);
    }
  };

  const loadActorId = async (loggedInUser: User) => {
    try {
      if (loggedInUser.role === 'clinic') {
         const res = await api.get('/clinics');
         const myClinic = res.data.find((c: any) => c.adminEmail === loggedInUser.email);
         if(myClinic) {
            setCurrentActorId(myClinic.id);
         } else if (res.data.length > 0) {
            setCurrentActorId(res.data[0].id);
         }
      } else if (loggedInUser.role === 'doctor') {
         const res = await api.get('/doctors');
         const doc = res.data.find((d: any) => d.name === loggedInUser.name);
         if(doc) {
            setCurrentActorId(doc.id);
         } else if (res.data.length > 0) {
            setCurrentActorId(res.data[0].id);
         }
      }
    } catch (e) {
      console.error("Failed to load actor ID", e);
    }
  };

  // Check auth on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      // Check for shared URL
      if (window.location.pathname.startsWith('/share/')) {
        setView('shared');
        setLoading(false);
        return;
      }

      try {
        const { user } = await authService.getMe();
        setUser(user);
        await loadActorId(user);
        setView('dashboard');
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Polling for new data every 10 seconds
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (user && view === 'dashboard') {
      interval = setInterval(() => {
        fetchData();
      }, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user, view]);

  // Fetch data when user logs in
  React.useEffect(() => {
    if (user && view === 'dashboard') {
      fetchData();
    }
  }, [user, view]);

  const handleLogin = async (role: string) => {
    // Quick Dev Access Mapper
    const devCredentials = {
      admin: { email: 'admin@laudodigital.com', password: 'admin123' },
      clinic: { email: 'contato@saudeplena.com', password: 'password' },
      doctor: { email: 'roberto.martins@doc.com', password: 'password' },
      doctor_ana: { email: 'ana.souza@doc.com', password: 'password' },
      patient: { email: 'carla.f@email.com', password: 'password' },
    } as const;

    try {
      const creds = devCredentials[role as keyof typeof devCredentials];
      const data = await authService.login(creds.email, creds.password);
      setUser(data.user);
      await loadActorId(data.user);
      setView('dashboard');
    } catch (err) {
      alert('Erro ao realizar login dev');
    }
  };

  const handleManualLogin = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      await loadActorId(data.user);
      setView('dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao realizar login');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentActorId('');
    setExams([]);
    setPatients([]);
    setView('login');
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
    file: File | null = null,
    clinicalHistory?: string,
    medicalRequestFile?: File | null
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
      if (clinicalHistory) formData.append('clinicalHistory', clinicalHistory);
      
      if (file) formData.append('dicom', file);
      if (medicalRequestFile) formData.append('medicalRequest', medicalRequestFile);

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

  const handleRegisterPatient = async (data: { name: string, cpf: string, email: string, sex?: string }) => {
    try {
      const response = await api.post('/patients', data);
      await fetchData();
      return response.data;
    } catch (err) {
      alert('Erro ao registrar paciente');
      throw err;
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Sincronizando...</p>
          </div>
        </div>
      );
    }

    switch (view) {
      case 'shared':
        return <SharedExamPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onManualLogin={handleManualLogin} onNavigateToLanding={navigateToLanding} />;
      case 'dashboard':
        if (!user) return <LoginPage onLogin={handleLogin} onManualLogin={handleManualLogin} onNavigateToLanding={navigateToLanding} />;
        return <DashboardPage
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
          onRefreshData={fetchData}
          currentActorId={currentActorId}
          totalUnreadMessages={totalUnreadMessages}
        />;
      case 'landing':
      default:
        return <LandingPage onNavigateToLogin={navigateToLogin} />;
    }
  };

  return (
    <ToastProvider>
      <div className="antialiased text-gray-800 bg-medical-background min-h-screen">{renderView()}</div>
    </ToastProvider>
  );
};

export default App;
