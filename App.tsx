
import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { mockDoctors, mockExams, mockPatients, mockPatientCarlaExams } from './data/mockData';
import type { Doctor, Exam, Patient, ExamModality, ExamUrgency } from './data/mockData';
import { ToastProvider } from './contexts/ToastContext';

export type UserRole = 'admin' | 'clinic' | 'doctor' | 'patient';

export interface User {
  name: string;
  role: UserRole;
  email: string;
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<User | null>(null);

  const [patients, setPatients] = useState<Patient[]>([...mockPatients, { id: 'p5', name: 'Carla Ferreira', cpf: '555.666.777-88', email: 'carla.f@email.com', clinicId: 'c1' }]);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [exams, setExams] = useState<Exam[]>([...mockExams, ...mockPatientCarlaExams]);

  const MOCK_USERS: Record<UserRole, User> = {
    admin: { name: 'Operador Sistema', role: 'admin', email: 'admin@laudodigital.com' },
    clinic: { name: 'Clínica Saúde Plena', role: 'clinic', email: 'contato@saudeplena.com' },
    doctor: { name: 'Dr. Roberto Martins', role: 'doctor', email: 'roberto.martins@doc.com' },
    patient: { name: 'Carla Ferreira', role: 'patient', email: 'carla.f@email.com' },
  };

  const handleLogin = (role: UserRole) => {
    setUser(MOCK_USERS[role]);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const navigateToLogin = () => setView('login');
  const navigateToLanding = () => setView('landing');

  const handleRequestExam = (
    patientId: string, 
    examType: string, 
    specialty: string, 
    price: number,
    modality: ExamModality = 'OT',
    urgency: ExamUrgency = 'Rotina',
    bodyPart: string = 'Não especificado'
  ) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    const newExam: Exam = {
      id: `e${Date.now()}`,
      patientId,
      patientName: patient.name,
      doctorAssignedId: null,
      doctorAssignedName: null,
      examType,
      modality,
      urgency,
      bodyPart,
      accessionNumber: `ACC-${Date.now().toString().slice(-6)}`,
      specialtyRequired: specialty,
      dateRequested: new Date().toISOString().split('T')[0],
      status: 'Disponível',
      price: price,
      clinicName: 'Clínica Saúde Plena',
      paymentStatus: 'Pendente'
    };
    setExams(prevExams => [newExam, ...prevExams]);
  };

  const handleAcceptExam = (examId: string, doctor: User) => {
    setExams(prevExams => prevExams.map(exam =>
      exam.id === examId ? { 
        ...exam, 
        status: 'Aguardando Laudo', 
        doctorAssignedName: doctor.name,
        doctorAssignedId: 'd1'
      } : exam
    ));
  };

  const handleCompleteReport = (examId: string, finalReport: string) => {
    setExams(prevExams => prevExams.map(exam =>
      exam.id === examId ? { ...exam, status: 'Concluído', finalReport } : exam
    ));
  };

  const handleRegisterPatient = (name: string, cpf: string, email: string) => {
    const newPatient: Patient = {
        id: `p${patients.length + 1}`,
        name,
        cpf,
        email,
        clinicId: 'c1',
    };
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigateToLanding={navigateToLanding} />;
      case 'dashboard':
        return user && <DashboardPage 
                          user={user} 
                          onLogout={handleLogout}
                          patients={patients}
                          doctors={doctors}
                          exams={exams}
                          onRequestExam={handleRequestExam}
                          onAcceptExam={(id) => handleAcceptExam(id, user)}
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
