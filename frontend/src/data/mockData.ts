
export interface Patient {
    id: string;
    name: string;
    cpf: string;
    email: string;
    clinicId: string;
}

export interface Doctor {
    id: string;
    name: string;
    crm: string;
    specialty: string;
    status: 'Ativo' | 'Pendente';
    joinedDate: string;
    rating: number;
}

export type ExamStatus = 'Disponível' | 'Aguardando Laudo' | 'Laudando' | 'Em Análise' | 'Concluído' | 'Recusado';
export type PaymentStatus = 'Pendente' | 'Pago' | 'Processando';
export type SubscriptionStatus = 'Ativa' | 'Atrasada' | 'Cancelada';
export type ExamModality = 'RX' | 'TC' | 'RM' | 'US' | 'MG' | 'OT';
export type ExamUrgency = 'Rotina' | 'Urgente';

export interface Clinic {
    id: string;
    name: string;
    location: string;
    subscriptionStatus: SubscriptionStatus;
    monthlyFee: number;
    examCount: number;
    joinedDate: string;
    adminEmail: string;
}

export interface GlobalStats {
    totalRevenue: number;
    totalTransferred: number;
    platformProfit: number;
    totalExamsProcessed: number;
    activeClinics: number;
    totalDoctors: number;
    monthlyGrowth: number;
    marketplaceTax: number;
    saasRevenue: number;
}

export interface Exam {
    id: string;
    patientId: string;
    patientName: string;
    doctorAssignedId: string | null;
    doctorAssignedName: string | null;
    examType: string;
    modality: ExamModality;
    urgency: ExamUrgency;
    bodyPart?: string;
    accessionNumber?: string;
    specialtyRequired: string;
    dateRequested: string;
    status: ExamStatus;
    price: number;
    clinicName: string;
    paymentStatus: PaymentStatus;
    examImageUrl?: string;
    aiDraft?: string;
    finalReport?: string;
    aiInsights?: string;
    dicomUrl?: string; // URL for the raw DICOM file/zip for listeners
}

export const mockGlobalStats: GlobalStats = {
    totalRevenue: 1258400.00,
    totalTransferred: 1069640.00,
    platformProfit: 188760.00,
    totalExamsProcessed: 42850,
    activeClinics: 112,
    totalDoctors: 485,
    monthlyGrowth: 22.5,
    marketplaceTax: 56400.00,
    saasRevenue: 132360.00
};

export const mockClinics: Clinic[] = [
    { id: 'c1', name: 'Clínica Saúde Plena', location: 'São Paulo, SP', subscriptionStatus: 'Ativa', monthlyFee: 1200.00, examCount: 1450, joinedDate: '2023-01-10', adminEmail: 'admin@saudeplena.com' },
    { id: 'c2', name: 'Centro Image Diagnósticos', location: 'Rio de Janeiro, RJ', subscriptionStatus: 'Ativa', monthlyFee: 1500.00, examCount: 2300, joinedDate: '2023-03-15', adminEmail: 'gestao@centroimage.com' },
    { id: 'c3', name: 'Hospital da Visão', location: 'Belo Horizonte, MG', subscriptionStatus: 'Atrasada', monthlyFee: 900.00, examCount: 450, joinedDate: '2023-06-20', adminEmail: 'financeiro@hvisao.com' },
    { id: 'c4', name: 'NeuroCenter Digital', location: 'Curitiba, PR', subscriptionStatus: 'Ativa', monthlyFee: 2200.00, examCount: 3100, joinedDate: '2023-08-01', adminEmail: 'ti@neurocenter.com' },
    { id: 'c5', name: 'Ortopedia Express', location: 'Recife, PE', subscriptionStatus: 'Ativa', monthlyFee: 800.00, examCount: 120, joinedDate: '2023-11-12', adminEmail: 'contato@ortoexpress.com' },
];

export const mockDoctors: Doctor[] = [
    { id: 'd1', name: 'Dr. Roberto Martins', crm: '12345-SP', specialty: 'Cardiologia', status: 'Ativo', joinedDate: '2023-02-10', rating: 4.9 },
    { id: 'd2', name: 'Dra. Lúcia Lima', crm: '54321-RJ', specialty: 'Radiologia', status: 'Ativo', joinedDate: '2023-04-15', rating: 4.8 },
    { id: 'd3', name: 'Dr. Fernando Gomes', crm: '67890-MG', specialty: 'Neurologia', status: 'Ativo', joinedDate: '2023-07-22', rating: 5.0 },
    { id: 'd4', name: 'Dra. Marina Silva', crm: '11223-SC', specialty: 'Radiologia', status: 'Ativo', joinedDate: '2023-09-01', rating: 4.7 },
    { id: 'd5', name: 'Dr. André Santos', crm: '44556-RS', specialty: 'Cardiologia', status: 'Pendente', joinedDate: '2023-12-05', rating: 0 },
];

export const mockPatients: Patient[] = [
    { id: 'p1', name: 'João Silva', cpf: '111.222.333-44', email: 'joao.silva@example.com', clinicId: 'c1' },
    { id: 'p2', name: 'Maria Oliveira', cpf: '222.333.444-55', email: 'maria.o@example.com', clinicId: 'c1' },
    { id: 'p3', name: 'Carlos Pereira', cpf: '333.444.555-66', email: 'carlos.p@example.com', clinicId: 'c1' },
    { id: 'p4', name: 'Ana Souza', cpf: '444.555.666-77', email: 'ana.souza@example.com', clinicId: 'c1' },
];

export const mockExams: Exam[] = [
    { id: 'e100', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Raio-X de Tórax', modality: 'RX', urgency: 'Rotina', bodyPart: 'Tórax', accessionNumber: 'ACC-2024-001', specialtyRequired: 'Radiologia', dateRequested: '2024-05-20', status: 'Concluído', price: 45.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pago', finalReport: 'Pulmões limpos.' },
    { id: 'e101', patientId: 'p2', patientName: 'Maria Oliveira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Eletrocardiograma', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-002', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-21', status: 'Concluído', price: 85.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pago', finalReport: 'Ritmo sinusal.' },
    { id: 'e102', patientId: 'p3', patientName: 'Carlos Pereira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'MAPA 24h', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-003', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-22', status: 'Concluído', price: 120.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pago', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/CT2_J2KR' },
    { id: 'e103', patientId: 'p4', patientName: 'Ana Souza', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Ecocardiograma', modality: 'US', urgency: 'Urgente', bodyPart: 'Coração', accessionNumber: 'ACC-2024-004', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-23', status: 'Aguardando Laudo', price: 150.00, clinicName: 'NeuroCenter Digital', paymentStatus: 'Pendente', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/mr-brain-jp2k.dcm' },
    { id: 'e104', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Holter 24h', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-005', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-24', status: 'Em Análise', price: 110.00, clinicName: 'Centro Image Diagnósticos', paymentStatus: 'Pendente', dicomUrl: 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323131.dcm' },
    { id: 'e105', patientId: 'p2', patientName: 'Maria Oliveira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Teste Ergométrico', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-006', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-24', status: 'Aguardando Laudo', price: 130.00, clinicName: 'Centro Image Diagnósticos', paymentStatus: 'Pendente', dicomUrl: 'https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CTImage.dcm' },
    { id: 'e1', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Raio-X do Tórax', modality: 'RX', urgency: 'Rotina', bodyPart: 'Tórax', accessionNumber: 'ACC-2024-007', specialtyRequired: 'Radiologia', dateRequested: '2024-05-18', status: 'Aguardando Laudo', price: 45.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pendente', examImageUrl: 'https://minio.scielo.br/documentstore/1678-7099/h635JPxxJTvRsdPhvmKYjxz/f2a629f46d89228b03fdcefe60dd4c2cb7dc469d.png', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/test-unsigned.dcm' },
    { id: 'e2', patientId: 'p2', patientName: 'Maria Oliveira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Eletrocardiograma', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-008', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-15', status: 'Concluído', price: 35.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pago', finalReport: 'Ritmo sinusal regular. Ausência de arritmias.' },
    { id: '1.3.6.1.4.1.25403.345050719074.3824.20170125095438.5', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: null, doctorAssignedName: null, examType: 'Ressonância Magnética do Crânio', modality: 'RM', urgency: 'Urgente', bodyPart: 'Crânio', accessionNumber: 'ACC-2024-009', specialtyRequired: 'Neurologia', dateRequested: '2024-05-25', status: 'Disponível', price: 200.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pendente', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/CT2_J2KR' },
    { id: 'e202', patientId: 'p2', patientName: 'Maria Oliveira', doctorAssignedId: null, doctorAssignedName: null, examType: 'Raio-X de Tórax (PA/Perfil)', modality: 'RX', urgency: 'Rotina', bodyPart: 'Tórax', accessionNumber: 'ACC-2024-010', specialtyRequired: 'Radiologia', dateRequested: '2024-05-25', status: 'Disponível', price: 50.00, clinicName: 'Hospital da Visão', paymentStatus: 'Pago', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/test-unsigned.dcm' },
    { id: 'e203', patientId: 'p3', patientName: 'Carlos Pereira', doctorAssignedId: null, doctorAssignedName: null, examType: 'Eletrocardiograma de Repouso', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-011', specialtyRequired: 'Cardiologia', dateRequested: '2024-05-26', status: 'Disponível', price: 40.00, clinicName: 'Ortopedia Express', paymentStatus: 'Pendente' },
    { id: 'e204', patientId: 'p4', patientName: 'Ana Souza', doctorAssignedId: null, doctorAssignedName: null, examType: 'Tomografia Computadorizada de Abdômen', modality: 'TC', urgency: 'Urgente', bodyPart: 'Abdômen', accessionNumber: 'ACC-2024-012', specialtyRequired: 'Radiologia', dateRequested: '2024-05-26', status: 'Disponível', price: 250.00, clinicName: 'Centro Image Diagnósticos', paymentStatus: 'Pago', dicomUrl: 'https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/testImages/CTImage.dcm' },
];

export const mockPatientCarlaExams: Exam[] = [
    { id: 'e7', patientId: 'p5', patientName: 'Carla Ferreira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Ecocardiograma', modality: 'US', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-013', specialtyRequired: 'Cardiologia', dateRequested: '2024-04-15', status: 'Concluído', price: 80.00, clinicName: 'Clínica Saúde Plena', paymentStatus: 'Pago', finalReport: 'Função biventricular preservada.' },
];

export const mockMonthlyEarningData = [
    { month: 'Dez', value: 4200 },
    { month: 'Jan', value: 5800 },
    { month: 'Fev', value: 5100 },
    { month: 'Mar', value: 7200 },
    { month: 'Abr', value: 6800 },
    { month: 'Mai', value: 9400 },
];

export const mockClinicPerformance = {
    weeklyExams: [
        { day: 'Seg', count: 65, profit: 2450 },
        { day: 'Ter', count: 42, profit: 1800 },
        { day: 'Qua', count: 88, profit: 3900 },
        { day: 'Qui', count: 55, profit: 2100 },
        { day: 'Sex', count: 110, profit: 5600 },
        { day: 'Sáb', count: 32, profit: 1200 },
        { day: 'Dom', count: 12, profit: 450 },
    ],
    rentabilityByExam: [
        { type: 'Ressonância Magnética', count: 120, revenue: 45000, margin: 65 },
        { type: 'Tomografia', count: 240, revenue: 32000, margin: 55 },
        { type: 'Ultrassom', count: 450, revenue: 18000, margin: 40 },
        { type: 'Raio-X', count: 890, revenue: 12000, margin: 30 }
    ]
};
