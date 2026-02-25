
import React, { useState } from 'react';
import api from '../lib/api';
import { User } from '../types/auth';
import type { Patient, Doctor, Exam, ExamModality, ExamUrgency } from '../data/mockData';
import { mockClinics } from '../data/mockData';
import DashboardLayout from '../components/layouts/DashboardLayout';
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
import { AdminSettingsPage } from '../components/dashboard/admin/AdminSettingsPage';
import { OhifViewer } from '../components/dashboard/shared/OhifViewer';
import { RequestExamModal } from '../components/dashboard/modals/RequestExamModal';
import { EditExamModal } from '../components/dashboard/modals/EditExamModal';
import { AddPatientModal } from '../components/dashboard/modals/AddPatientModal';
import { DoctorChat } from '../components/dashboard/shared/DoctorChat';
import { ClinicSchedulePage, ClinicDoctorsContactPage, ClinicAdminSupportPage, ClinicProfilePage } from '../components/dashboard/clinic/ClinicPages';
import { DoctorProfilePage } from '../components/dashboard/doctor/DoctorProfilePage';
import { DoctorSettingsPage } from '../components/dashboard/doctor/DoctorSettingsPage';
import { ClinicSettingsPage } from '../components/dashboard/clinic/ClinicSettingsPage';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  patients: Patient[];
  doctors: Doctor[];
  exams: Exam[];
  stats: any;
  onRequestExam: (
    patientId: string,
    examType: string,
    specialty: string,
    price: number,
    modality: ExamModality,
    urgency: ExamUrgency,
    bodyPart: string,
    file: File | null,
    clinicalHistory?: string,
    medicalRequestFile?: File | null
  ) => void;
  onAcceptExam: (examId: string) => void;
  onCompleteReport: (examId: string, report: string) => void;
  onRegisterPatient: (data: { name: string, cpf: string, email: string, sex?: string }) => void;
  onRefreshData: () => void;
  currentActorId: string;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { user, onLogout, patients, doctors, exams, stats, onRequestExam, onAcceptExam, onCompleteReport, onRegisterPatient, onRefreshData, currentActorId } = props;

  const [currentView, setCurrentView] = useState<string>('overview');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isEditExamModalOpen, setIsEditExamModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [preSelectedPatientId, setPreSelectedPatientId] = useState<string>('');
  const [isDutyMode, setIsDutyMode] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  const [chatInitialDoctorId, setChatInitialDoctorId] = useState<string | undefined>(undefined);
  const [chatInitialExamId, setChatInitialExamId] = useState<string | undefined>(undefined);

  const handleOpenRequestExam = (patientId: string = '') => {
    setPreSelectedPatientId(patientId);
    setIsRequestModalOpen(true);
  };

  const handleOpenEditExam = (examId: string) => {
    setSelectedExamId(examId);
    setIsEditExamModalOpen(true);
  };

  const navigateTo = (view: string, id: string | null = null) => {
    setCurrentView(view);
    setDetailId(id);
  };

  const handleOpenChat = (doctorId?: string, examId?: string) => {
    setChatInitialDoctorId(doctorId);
    setChatInitialExamId(examId);
    setCurrentView('chat');
  };

  const handleSavePatientAndRequest = async (data: { name: string, cpf: string, email: string, sex?: string }) => {
    try {
      const newPatient = await onRegisterPatient(data);
      if (newPatient && newPatient.id) {
        handleOpenRequestExam(newPatient.id);
      }
    } catch (error) {
       console.error("Error in save and request chain:", error);
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        if (currentView === 'ai_lab') return <AiLab />;
        if (currentView === 'clinics') return <ClinicManagement />;
        if (currentView === 'doctors_db') return <DoctorsDatabase />;
        if (currentView === 'system_financial') return <SystemFinancialPage />;
        if (currentView === 'settings') return <AdminSettingsPage />;
        return <AdminOverview stats={stats} />;

      case 'clinic':
        const clinicExams = exams.filter(e => patients.some(p => p.clinicId === 'c1' && p.id === e.patientId));
        const clinicPatients = patients.filter(p => p.clinicId === 'c1');

        if (currentView === 'ohif_viewer' && detailId) {
          const exam = exams.find(e => e.id === detailId);
          return exam ? <OhifViewer dicomUrl={exam.dicomUrl || ''} onBack={() => navigateTo('exam_detail', detailId)} /> : null;
        }
        if (currentView === 'exam_detail' && detailId) {
          const exam = exams.find(e => e.id === detailId);
          return exam ? <ExamDetailPage
            exam={exam}
            userRole="clinic"
            onOpenOhif={() => navigateTo('ohif_viewer', detailId)}
            onOpenChat={() => handleOpenChat(exam.doctorAssignedId || undefined, exam.id)}
            onRefreshData={onRefreshData}
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'exams') {
          return (
            <ClinicExamsPage
              exams={clinicExams}
              onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
              onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
              onOpenRequestExam={handleOpenRequestExam}
              onEditExam={handleOpenEditExam}
              onDeleteExam={async (id) => {
                try {
                  await api.delete(`/exams/${id}`);
                  onRefreshData();
                } catch (error) {
                  alert('Erro ao deletar exame');
                }
              }}
            />
          );
        }
        if (currentView === 'patients') return <ClinicPatientsPage patients={clinicPatients} onRegisterPatient={onRegisterPatient} />;
        if (currentView === 'financial') return <ClinicFinancialPage exams={clinicExams} />;
        
        // New Clinic Pages
        if (currentView === 'exam_schedule') return <ClinicSchedulePage />;
        if (currentView === 'doctors_contact') {
            const clinicDoctors = doctors.filter(d => clinicExams.some(e => e.doctorAssignedId === d.id));
            return <ClinicDoctorsContactPage doctors={clinicDoctors} onContact={(id) => handleOpenChat(id)} />;
        }
        if (currentView === 'admin_support') return <ClinicAdminSupportPage />;
        if (currentView === 'profile') return <ClinicProfilePage />;
        if (currentView === 'settings') return <ClinicSettingsPage />;
        if (currentView === 'chat') {
            return <DoctorChat 
                currentUser={user} 
                currentActorId={currentActorId || 'c1'}
                doctors={doctors} 
                exams={clinicExams} 
                initialDoctorId={chatInitialDoctorId}
                initialExamId={chatInitialExamId} 
            />;
        }

        return (
          <>
            <ClinicOverview
              exams={clinicExams}
              doctors={doctors}
              patients={clinicPatients}
              stats={stats}
              onRequestExam={onRequestExam}
              onOpenRequestExam={handleOpenRequestExam}
              onNavigateToExams={() => navigateTo('exams')}
              onNavigateToPatients={() => setIsAddPatientModalOpen(true)}
              onNavigateToFinancial={() => navigateTo('financial')}
              onNavigateToDoctors={() => navigateTo('doctors_contact')}
            />
          </>
        );

      case 'doctor':
        const doctorExams = exams.filter(e => e.status !== 'Disponível');
        const hasActiveExam = exams.some(e => e.doctorAssignedId === user.id && ['Laudando', 'Em Análise'].includes(e.status));

        if (currentView === 'ohif_viewer' && detailId) {
          const exam = exams.find(e => e.id === detailId);
          return exam ? <OhifViewer dicomUrl={exam.dicomUrl || ''} onBack={() => navigateTo('exam_detail', detailId)} /> : null;
        }
        if (currentView === 'exam_detail' && detailId) {
          const exam = exams.find(e => e.id === detailId);
          return exam ? <ExamDetailPage
            exam={exam}
            userRole="doctor"
            onBack={() => navigateTo('pending_exams')}
            onCompleteReport={onCompleteReport}
            onOpenOhif={() => navigateTo('ohif_viewer', detailId)}
            onOpenChat={() => handleOpenChat(exam.clinicId || undefined, exam.id)}
            onRefreshData={onRefreshData}
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'marketplace') {
          return <MarketplaceExams exams={exams} onAccept={onAcceptExam} hasActiveExam={false} isDutyMode={isDutyMode} />;
        }
        if (currentView === 'ai_consult') return <DoctorAiConsultation />;
        if (currentView === 'pending_exams') {
          return <DoctorExamsPage
            exams={doctorExams}
            onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
            onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
            initialTab="pending"
          />;
        }
        if (currentView === 'history') {
          return <DoctorExamsPage
            exams={doctorExams}
            initialTab="completed"
            onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
            onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
          />;
        }
        if (currentView === 'financial') return <DoctorFinancialPage exams={doctorExams} />;
        if (currentView === 'profile') return <DoctorProfilePage />;
        if (currentView === 'settings') return <DoctorSettingsPage />;
        if (currentView === 'chat') {
            return <DoctorChat 
                currentUser={user} 
                currentActorId={currentActorId || 'd1'}
                doctors={doctors}
                otherParticipants={mockClinics}
                exams={doctorExams} 
                initialDoctorId={chatInitialDoctorId} 
                initialExamId={chatInitialExamId}
            />;
        }
        
        return <DoctorOverview
          exams={doctorExams}
          allExams={exams}
          onNavigateToPendingExams={() => navigateTo('pending_exams')}
          onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
          onNavigateToMarketplace={() => navigateTo('marketplace')}
          onNavigateToAiConsult={() => navigateTo('ai_consult')}
          onNavigateToFinancial={() => navigateTo('financial')}
          onNavigateToChat={() => handleOpenChat()}
          onAcceptExam={onAcceptExam}
          isDutyMode={isDutyMode}
          onToggleDutyMode={() => setIsDutyMode(prev => !prev)}
        />;

      case 'patient':
        const patientExams = exams.filter(e => e.patientName === user.name);
        
        if (currentView === 'ohif_viewer' && detailId) {
          const exam = patientExams.find(e => e.id === detailId);
          return exam ? <OhifViewer dicomUrl={exam.dicomUrl || ''} onBack={() => navigateTo('exam_detail', detailId)} /> : null;
        }
        if (currentView === 'exam_detail' && detailId) {
          const exam = patientExams.find(e => e.id === detailId);
          return exam ? <ExamDetailPage
            exam={exam}
            userRole="patient"
            onBack={() => navigateTo('completed_exams')}
            onOpenOhif={() => navigateTo('ohif_viewer', detailId)}
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }

        if (currentView === 'completed_exams') return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} initialTab="completed" />;
        if (currentView === 'pending_exams') return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} initialTab="pending" />;
        if (currentView === 'scheduled_exams') return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} initialTab="scheduled" />;
        if (currentView === 'profile') return <PlaceholderPage title="Meu Perfil" />;

        // Default overview
        return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} initialTab="completed" />;


      default:
        return <div>Papel de usuário desconhecido.</div>;
    }
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      onNavigate={navigateTo}
      currentView={currentView}
    >
      {renderDashboard()}

      {/* Modals */}
      <RequestExamModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={onRequestExam}
        patients={patients}
        initialPatientId={preSelectedPatientId}
        onOpenRegisterPatient={() => setIsAddPatientModalOpen(true)}
      />

      <EditExamModal
        isOpen={isEditExamModalOpen}
        onClose={() => {
          setIsEditExamModalOpen(false);
          setSelectedExamId(null);
        }}
        examId={selectedExamId || ''}
        exam={exams.find(e => e.id === selectedExamId)}
        onUpdate={onRefreshData}
      />

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSubmit={onRegisterPatient}
        onSubmitAndRequest={handleSavePatientAndRequest}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
