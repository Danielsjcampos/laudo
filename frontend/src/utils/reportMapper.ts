import { Exam, Patient, Doctor, Clinic } from '../data/mockData';
import { ReportData } from '../types/report';

export const mapExamToReportData = (
    exam: Exam,
    patient?: Patient,
    doctor?: Doctor,
    clinic?: Clinic
): ReportData => {
    // Generate dynamic HTML block for patient
    const patientHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Nome:</strong> ${exam.patientName}</div>
            <div><strong>ID:</strong> ${exam.patientId}</div>
            <div><strong>Exame:</strong> ${exam.examType}</div>
            <div><strong>Data:</strong> ${new Date(exam.dateRequested).toLocaleDateString('pt-BR')}</div>
            ${patient?.birthDate ? `<div><strong>Nasc:</strong> ${patient.birthDate}</div>` : ''}
            ${patient?.sex ? `<div><strong>Sexo:</strong> ${patient.sex}</div>` : ''}
        </div>
    `;

    return {
        NOME_CLINICA: exam.clinicName || clinic?.name || 'Clínica Médica',
        LOGOTIPO_CLINICA: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', // Placeholder
        DADOS_PACIENTE_DYNAMIC_BLOCK: patientHtml,
        CORPO_DO_LAUDO: exam.finalReport || '<p>Laudo em processamento...</p>',
        ASSINATURA_DIGITAL_MEDICO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png', // Placeholder
        NOME_MEDICO: exam.doctorAssignedName || doctor?.name || 'Dr. Médico Responsável',
        CRM_MEDICO: doctor?.crm || '12345-SP',
    };
};
