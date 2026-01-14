
import React, { useState } from 'react';
import type { User } from '../App';
import type { Patient, Doctor, Exam } from '../data/mockData';
import Sidebar from '../components/dashboard/Sidebar';
import ClinicOverview from '../components/dashboard/clinic/ClinicOverview';
import DoctorOverview from '../components/dashboard/doctor/DoctorOverview';
import MarketplaceExams from '../components/dashboard/doctor/MarketplaceExams';
import PatientExamsPage from '../components/dashboard/patient/PatientExamsPage';
import ClinicExamsPage from '../components/dashboard/clinic/ClinicExamsPage';
import ClinicPatientsPage from '../components/dashboard/clinic/ClinicPatientsPage';
import ExamDetailPage from '../components/dashboard/shared/ExamDetailPage';
import PlaceholderPage from '../components/dashboard/shared/PlaceholderPage';
import DoctorExamsPage from '../components/dashboard/doctor/DoctorExamsPage';
import DoctorAiConsultation from '../components/dashboard/doctor/DoctorAiConsultation';
import ClinicFinancialPage from '../components/dashboard/clinic/ClinicFinancialPage';
import DoctorFinancialPage from '../components/dashboard/doctor/DoctorFinancialPage';
import AdminOverview from '../components/dashboard/admin/AdminOverview';
import AiLab from '../components/dashboard/admin/AiLab';
import ClinicManagement from '../components/dashboard/admin/ClinicManagement';
import DoctorsDatabase from '../components/dashboard/admin/DoctorsDatabase';
import SystemFinancialPage from '../components/dashboard/admin/SystemFinancialPage';
import { MenuIcon } from '../components/icons/MenuIcon';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  patients: Patient[];
  doctors: Doctor[];
  exams: Exam[];
  onRequestExam: (patientId: string, examType: string, specialty: string, price: number) => void;
  onAcceptExam: (examId: string) => void;
  onCompleteReport: (examId: string, report: string) => void;
  onRegisterPatient: (name: string, cpf: string, email: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { user, onLogout, patients, doctors, exams, onRequestExam, onAcceptExam, onCompleteReport, onRegisterPatient } = props;

  const [currentView, setCurrentView] = useState<string>('overview');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigateTo = (view: string, id: string | null = null) => {
    setCurrentView(view);
    setDetailId(id);
    setIsSidebarOpen(false);
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        if (currentView === 'ai_lab') return <AiLab />;
        if (currentView === 'clinics') return <ClinicManagement />;
        if (currentView === 'doctors_db') return <DoctorsDatabase />;
        if (currentView === 'system_financial') return <SystemFinancialPage />;
        return <AdminOverview />;

      case 'clinic':
        const clinicExams = exams.filter(e => patients.some(p => p.clinicId === 'c1' && p.id === e.patientId));
        const clinicPatients = patients.filter(p => p.clinicId === 'c1');
        
        if (currentView === 'exam_detail' && detailId) {
            const exam = exams.find(e => e.id === detailId);
            return exam ? <ExamDetailPage exam={exam} userRole="clinic" onBack={() => navigateTo('exams')} /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'exams') {
            return <ClinicExamsPage exams={clinicExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} />;
        }
        if (currentView === 'patients') {
            return <ClinicPatientsPage patients={clinicPatients} onRegisterPatient={onRegisterPatient} />;
        }
        if (currentView === 'financial') {
            return <ClinicFinancialPage exams={clinicExams} />;
        }
        return <ClinicOverview 
                    exams={clinicExams} 
                    doctors={doctors}
                    patients={clinicPatients}
                    onRequestExam={onRequestExam}
                    onNavigateToExams={() => navigateTo('exams')}
                />;

      case 'doctor':
        const doctorExams = exams.filter(e => e.doctorAssignedName === user.name);

        if (currentView === 'exam_detail' && detailId) {
            const exam = exams.find(e => e.id === detailId);
            return exam ? <ExamDetailPage exam={exam} userRole="doctor" onBack={() => navigateTo('pending_exams')} onCompleteReport={onCompleteReport} /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'marketplace') {
            return <MarketplaceExams exams={exams} onAccept={onAcceptExam} />;
        }
        if (currentView === 'ai_consult') {
            return <DoctorAiConsultation />;
        }
        if (currentView === 'pending_exams') {
            return <DoctorExamsPage exams={doctorExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} onCompleteReport={(id) => onCompleteReport(id, 'Concluído via listagem')} />;
        }
        if (currentView === 'financial') {
            return <DoctorFinancialPage exams={doctorExams} />;
        }
        return <DoctorOverview 
                  exams={doctorExams}
                  onCompleteReport={(id) => onCompleteReport(id, 'Concluído via painel')}
                  onNavigateToPendingExams={() => navigateTo('pending_exams')}
                  onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
                />;

      case 'patient':
        const patientExams = exams.filter(e => e.patientName === user.name);
        if (currentView === 'exam_detail' && detailId) {
            const exam = patientExams.find(e => e.id === detailId);
            return exam ? <ExamDetailPage exam={exam} userRole="patient" onBack={() => navigateTo('my_exams')} /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} />;
      
      default:
        return <div>Papel de usuário desconhecido.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        onNavigate={navigateTo} 
        currentView={currentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Mobile */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-brand-blue-600 transition-colors"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <StethoscopeIcon className="h-6 w-6 text-brand-blue-600" />
            <span className="font-bold text-gray-800 text-sm">LaudoDigital</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-blue-100 text-brand-blue-600 flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 focus:outline-none">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
