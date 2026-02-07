
import React, { useState } from 'react';
import type { User } from '../App';
import type { Patient, Doctor, Exam, ExamModality, ExamUrgency } from '../data/mockData';
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
import { OhifViewer } from '../components/dashboard/shared/OhifViewer';
import { RequestExamModal } from '../components/dashboard/modals/RequestExamModal';


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
    file: File | null
  ) => void;
  onAcceptExam: (examId: string) => void;
  onCompleteReport: (examId: string, report: string) => void;
  onRegisterPatient: (name: string, cpf: string, email: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { user, onLogout, patients, doctors, exams, stats, onRequestExam, onAcceptExam, onCompleteReport, onRegisterPatient } = props;

  const [currentView, setCurrentView] = useState<string>('overview');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [preSelectedPatientId, setPreSelectedPatientId] = useState<string>('');

  const handleOpenRequestExam = (patientId: string = '') => {
    setPreSelectedPatientId(patientId);
    setIsRequestModalOpen(true);
  };

  const navigateTo = (view: string, id: string | null = null) => {
    setCurrentView(view);
    setDetailId(id);
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        if (currentView === 'ai_lab') return <AiLab />;
        if (currentView === 'clinics') return <ClinicManagement />;
        if (currentView === 'doctors_db') return <DoctorsDatabase />;
        if (currentView === 'system_financial') return <SystemFinancialPage />;
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
            onBack={() => navigateTo('exams')}
            onOpenOhif={() => navigateTo('ohif_viewer', detailId)}
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'exams') {
          return <ClinicExamsPage
            exams={clinicExams}
            onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
            onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
            onOpenRequestExam={handleOpenRequestExam}
            onEditExam={(id) => {
              // TODO: Implement edit modal
              alert('Editar exame: ' + id);
            }}
            onDeleteExam={async (id) => {
              try {
                await fetch(`http://localhost:3001/api/exams/${id}`, {
                  method: 'DELETE',
                  credentials: 'include'
                });
                window.location.reload();
              } catch (error) {
                alert('Erro ao deletar exame');
              }
            }}
          />;
        }
        if (currentView === 'patients') {
          return <ClinicPatientsPage patients={clinicPatients} onRegisterPatient={onRegisterPatient} />;
        }
        if (currentView === 'financial') {
          return <ClinicFinancialPage exams={clinicExams} />;
        }
        return (
          <>
            <RequestExamModal
              isOpen={isRequestModalOpen}
              onClose={() => setIsRequestModalOpen(false)}
              patients={patients}
              onSubmit={onRequestExam}
            // initialPatientId={preSelectedPatientId} // Passado via prop, preciso adicionar no Modal
            />
            <ClinicOverview
              exams={clinicExams}
              doctors={doctors}
              patients={clinicPatients}
              stats={stats}
              onRequestExam={onRequestExam}
              onOpenRequestExam={handleOpenRequestExam}
              onNavigateToExams={() => navigateTo('exams')}
            />
          </>
        );

      case 'doctor':
        // Fix: Filter by status instead of name match. 
        // Backend already guarantees that non-available exams returned are assigned to this doctor.
        const doctorExams = exams.filter(e => e.status !== 'Disponível');

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
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        if (currentView === 'marketplace') {
          return <MarketplaceExams exams={exams} onAccept={onAcceptExam} />;
        }
        if (currentView === 'ai_consult') {
          return <DoctorAiConsultation />;
        }
        if (currentView === 'pending_exams') {
          return <DoctorExamsPage
            exams={doctorExams}
            onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
            onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
          />;
        }
        if (currentView === 'history') {
          return <DoctorExamsPage
            exams={doctorExams}
            initialTab="completed" // This prop needs to be added to DoctorExamsPage
            onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
            onOpenOhif={(id) => navigateTo('ohif_viewer', id)}
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
        if (currentView === 'financial') {
          return <DoctorFinancialPage exams={doctorExams} />;
        }
        return <DoctorOverview
          exams={doctorExams}
          onNavigateToPendingExams={() => navigateTo('pending_exams')}
          onNavigateToDetail={(id) => navigateTo('exam_detail', id)}
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
            onBack={() => navigateTo('my_exams')}
            onOpenOhif={() => navigateTo('ohif_viewer', detailId)}
          /> : <PlaceholderPage title="Exame não encontrado" />;
        }
        return <PatientExamsPage exams={patientExams} onNavigateToDetail={(id) => navigateTo('exam_detail', id)} />;

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
    </DashboardLayout>
  );
};

export default DashboardPage;
