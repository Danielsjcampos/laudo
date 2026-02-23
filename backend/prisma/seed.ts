
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')
  try {
    await prisma.exam.deleteMany()
    await prisma.patient.deleteMany()
    await prisma.doctor.deleteMany()
    await prisma.clinic.deleteMany()
    await prisma.globalStats.deleteMany()
    await prisma.user.deleteMany()
  } catch (e) {
    console.log('Tables might be empty or not created yet, continuing...')
  }

  console.log('Seeding data...')

  // Global Stats
  await prisma.globalStats.create({
    data: {
      id: 1,
      totalRevenue: 1258400.00,
      totalTransferred: 1069640.00,
      platformProfit: 188760.00,
      totalExamsProcessed: 42850,
      activeClinics: 112,
      totalDoctors: 485,
      monthlyGrowth: 22.5,
      marketplaceTax: 56400.00,
      saasRevenue: 132360.00
    }
  })

  // Clinics
  await prisma.clinic.create({
    data: {
      id: 'c1',
      name: 'Clínica Saúde Plena',
      location: 'São Paulo, SP',
      subscriptionStatus: 'Ativa',
      monthlyFee: 1200.00,
      examCount: 1450,
      joinedDate: new Date('2023-01-10'),
      adminEmail: 'contato@saudeplena.com'
    }
  })

  await prisma.clinic.createMany({
    data: [
      { id: 'c2', name: 'Centro Image Diagnósticos', location: 'Rio de Janeiro, RJ', subscriptionStatus: 'Ativa', monthlyFee: 1500.00, examCount: 2300, joinedDate: new Date('2023-03-15'), adminEmail: 'gestao@centroimage.com' },
      { id: 'c3', name: 'Hospital da Visão', location: 'Belo Horizonte, MG', subscriptionStatus: 'Atrasada', monthlyFee: 900.00, examCount: 450, joinedDate: new Date('2023-06-20'), adminEmail: 'financeiro@hvisao.com' },
      { id: 'c4', name: 'NeuroCenter Digital', location: 'Curitiba, PR', subscriptionStatus: 'Ativa', monthlyFee: 2200.00, examCount: 3100, joinedDate: new Date('2023-08-01'), adminEmail: 'ti@neurocenter.com' },
      { id: 'c5', name: 'Ortopedia Express', location: 'Recife, PE', subscriptionStatus: 'Ativa', monthlyFee: 800.00, examCount: 120, joinedDate: new Date('2023-11-12'), adminEmail: 'contato@ortoexpress.com' },
    ]
  })

  // Doctors
  await prisma.doctor.create({
    data: {
      id: 'd1',
      name: 'Dr. Roberto Martins',
      crm: '12345-SP',
      specialty: 'Cardiologia',
      status: 'Ativo',
      joinedDate: new Date('2023-02-10'),
      rating: 4.9
    }
  })

  await prisma.doctor.createMany({
    data: [
      { id: 'd2', name: 'Dra. Ana Souza', crm: '98765-SP', specialty: 'Radiologia', status: 'Ativo', joinedDate: new Date('2023-04-15'), rating: 4.8 },
      { id: 'd3', name: 'Dr. Fernando Gomes', crm: '67890-MG', specialty: 'Neurologia', status: 'Ativo', joinedDate: new Date('2023-07-22'), rating: 5.0 },
      { id: 'd4', name: 'Dra. Marina Silva', crm: '11223-SC', specialty: 'Radiologia', status: 'Ativo', joinedDate: new Date('2023-09-01'), rating: 4.7 },
      { id: 'd5', name: 'Dr. André Santos', crm: '44556-RS', specialty: 'Cardiologia', status: 'Pendente', joinedDate: new Date('2023-12-05'), rating: 0 },
    ]
  })

  // Patients
  await prisma.patient.createMany({
    data: [
      { id: 'p1', name: 'João Silva', cpf: '111.222.333-44', email: 'joao.silva@example.com', clinicId: 'c1' },
      { id: 'p2', name: 'Maria Oliveira', cpf: '222.333.444-55', email: 'maria.o@example.com', clinicId: 'c1' },
      { id: 'p3', name: 'Carlos Pereira', cpf: '333.444.555-66', email: 'carlos.p@example.com', clinicId: 'c1' },
      { id: 'p4', name: 'Ana Souza', cpf: '444.555.666-77', email: 'ana.souza@example.com', clinicId: 'c1' },
      { id: 'p5', name: 'Carla Ferreira', cpf: '555.666.777-88', email: 'carla.f@email.com', clinicId: 'c1' },
    ]
  })

  // Exams
  await prisma.exam.createMany({
    data: [
      { id: 'e100', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Raio-X de Tórax', modality: 'RX', urgency: 'Rotina', bodyPart: 'Tórax', accessionNumber: 'ACC-2024-001', specialtyRequired: 'Radiologia', dateRequested: new Date('2024-05-20'), status: 'Concluído', price: 45.00, clinicName: 'Clínica Saúde Plena', clinicId: 'c1', paymentStatus: 'Pago', finalReport: 'Pulmões limpos.' },
      { id: 'e101', patientId: 'p2', patientName: 'Maria Oliveira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Eletrocardiograma', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-002', specialtyRequired: 'Cardiologia', dateRequested: new Date('2024-05-21'), status: 'Concluído', price: 85.00, clinicName: 'Clínica Saúde Plena', clinicId: 'c1', paymentStatus: 'Pago', finalReport: 'Ritmo sinusal.' },
      { id: 'e102', patientId: 'p3', patientName: 'Carlos Pereira', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'MAPA 24h', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-003', specialtyRequired: 'Cardiologia', dateRequested: new Date('2024-05-22'), status: 'Concluído', price: 120.00, clinicName: 'Clínica Saúde Plena', clinicId: 'c1', paymentStatus: 'Pago', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/CT2_J2KR' },
      { id: 'e103', patientId: 'p4', patientName: 'Ana Souza', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Ecocardiograma', modality: 'US', urgency: 'Urgente', bodyPart: 'Coração', accessionNumber: 'ACC-2024-004', specialtyRequired: 'Cardiologia', dateRequested: new Date('2024-05-23'), status: 'Aguardando Laudo', price: 150.00, clinicName: 'NeuroCenter Digital', clinicId: 'c4', paymentStatus: 'Pendente', dicomUrl: 'https://github.com/cornerstonejs/cornerstoneWADOImageLoader/raw/master/testImages/mr-brain-jp2k.dcm' },
      { id: 'e104', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: 'd1', doctorAssignedName: 'Dr. Roberto Martins', examType: 'Holter 24h', modality: 'OT', urgency: 'Rotina', bodyPart: 'Coração', accessionNumber: 'ACC-2024-005', specialtyRequired: 'Cardiologia', dateRequested: new Date('2024-05-24'), status: 'Em Análise', price: 110.00, clinicName: 'Centro Image Diagnósticos', clinicId: 'c2', paymentStatus: 'Pendente', dicomUrl: 'https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323131.dcm' },
      { id: 'e201', patientId: 'p1', patientName: 'João Silva', doctorAssignedId: null, doctorAssignedName: null, examType: 'Ressonância Magnética do Crânio', modality: 'RM', urgency: 'Urgente', bodyPart: 'Crânio', accessionNumber: 'ACC-2024-009', specialtyRequired: 'Neurologia', dateRequested: new Date('2024-05-25'), status: 'Disponível', price: 200.00, clinicName: 'Clínica Saúde Plena', clinicId: 'c1', paymentStatus: 'Pendente' }
    ]
  })

  // Users for Login
  console.log('Hashing passwords...')
  const hashedPassword = await bcrypt.hash('password', 10)
  const adminHashed = await bcrypt.hash('admin123', 10)

  await prisma.user.createMany({
    data: [
      { id: 'u1', name: 'Operador Sistema', role: 'admin', email: 'admin@laudodigital.com', password: adminHashed },
      { id: 'u2', name: 'Clínica Saúde Plena', role: 'clinic', email: 'contato@saudeplena.com', password: hashedPassword },
      { id: 'u3', name: 'Dr. Roberto Martins', role: 'doctor', email: 'roberto.martins@doc.com', password: hashedPassword },
      { id: 'u5', name: 'Dra. Ana Souza', role: 'doctor', email: 'ana.souza@doc.com', password: hashedPassword },
      { id: 'u4', name: 'Carla Ferreira', role: 'patient', email: 'carla.f@email.com', password: hashedPassword },
    ]
  })

  // Pricing Table
  console.log('Seeding Pricing Table...')
  const pricingData = [
    { modality: 'RX', urgency: 'Rotina', price: 40.0 },
    { modality: 'RX', urgency: 'Urgente', price: 60.0 },
    { modality: 'TC', urgency: 'Rotina', price: 120.0 },
    { modality: 'TC', urgency: 'Urgente', price: 180.0 },
    { modality: 'RM', urgency: 'Rotina', price: 250.0 },
    { modality: 'RM', urgency: 'Urgente', price: 350.0 },
    { modality: 'US', urgency: 'Rotina', price: 80.0 },
    { modality: 'US', urgency: 'Urgente', price: 120.0 },
    { modality: 'MG', urgency: 'Rotina', price: 90.0 },
    { modality: 'MG', urgency: 'Urgente', price: 130.0 },
    { modality: 'OT', urgency: 'Rotina', price: 50.0 },
    { modality: 'OT', urgency: 'Urgente', price: 80.0 },
  ]

  for (const item of pricingData) {
    await prisma.pricingTable.upsert({
      where: {
        modality_urgency: {
          modality: item.modality,
          urgency: item.urgency
        }
      },
      update: { price: item.price },
      create: item
    })
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
