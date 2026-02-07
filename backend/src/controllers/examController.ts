import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { processDicomFile } from '../services/dicomService';
import path from 'path';

const ExamCreateSchema = z.object({
  patientId: z.string(),
  examType: z.string(),
  specialtyRequired: z.string(),
  price: z.preprocess((val) => Number(val), z.number()),
  modality: z.string(),
  urgency: z.string(),
  bodyPart: z.string().optional(),
});

export const getExams = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const role = user?.role;
    const userId = user?.userId;
    const email = user?.email;

    let exams;
    if (role === 'admin') {
      exams = await prisma.exam.findMany({ orderBy: { dateRequested: 'desc' } });
    } else if (role === 'clinic') {
      // Find clinic by adminEmail (stored in User.email)
      const clinic = await prisma.clinic.findFirst({ where: { adminEmail: email } });
      if (!clinic) {
        return res.status(404).json({ error: 'Clínica não encontrada' });
      }
      exams = await prisma.exam.findMany({
        where: { clinicId: clinic.id },
        orderBy: { dateRequested: 'desc' }
      });
    } else if (role === 'doctor') {
      // Return assigned exams OR available exams (Marketplace)

      // Fix: Resolve Doctor Entity ID from User
      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      let doctorId = null;

      if (dbUser) {
        const doctor = await prisma.doctor.findFirst({ where: { name: dbUser.name } });
        if (doctor) {
          doctorId = doctor.id;
        }
      }

      exams = await prisma.exam.findMany({
        where: {
          OR: [
            // If we found the doctor profile, use it. Otherwise, this condition will fail safely (null).
            ...(doctorId ? [{ doctorAssignedId: doctorId }] : []),
            { status: 'Disponível' }
          ]
        },
        orderBy: { dateRequested: 'desc' }
      });
    } else if (role === 'patient') {
      const patient = await prisma.patient.findFirst({ where: { email: email } });
      exams = await prisma.exam.findMany({
        where: { patientId: patient?.id },
        orderBy: { dateRequested: 'desc' }
      });
    }

    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar exames' });
  }
};

export const createExam = async (req: Request, res: Response) => {
  try {
    console.log('📥 Received exam creation request');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('File:', req.file ? { filename: req.file.filename, size: req.file.size } : 'No file');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Body values:', Object.values(req.body));

    const data = ExamCreateSchema.parse(req.body);
    console.log('✅ Schema validation passed:', data);

    const file = req.file;

    // Find patient and clinic
    console.log('🔍 Looking for patient:', data.patientId);
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId }, include: { clinic: true } });
    if (!patient) {
      console.log('❌ Patient not found');
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    console.log('✅ Patient found:', patient.name);

    let dicomUrl = null;
    let examImageUrl = null;
    let extractedPatientName = patient.name;
    let extractedStudyUID = null;

    if (file) {
      console.log('📁 Processing DICOM file:', file.filename);
      dicomUrl = `/uploads/dicom/${file.filename}`;
      const previewDir = path.join(process.cwd(), 'uploads', 'previews');

      try {
        const result = await processDicomFile(file.path, previewDir);
        examImageUrl = result.previewUrl;
        if (result.metadata.patientName && result.metadata.patientName !== 'Não identificado') {
          extractedPatientName = Array.isArray(result.metadata.patientName)
            ? result.metadata.patientName[0]
            : String(result.metadata.patientName);
        }
        if (result.metadata.studyInstanceUID) {
          extractedStudyUID = String(result.metadata.studyInstanceUID);
        }
        console.log('✅ DICOM processed successfully');
      } catch (procError) {
        console.error('⚠️ DICOM processing failed, but continuing with database entry:', procError);
      }
    }

    console.log('💾 Creating exam in database...');
    const examData = {
      patientId: data.patientId,
      patientName: extractedPatientName,
      examType: data.examType,
      modality: data.modality,
      urgency: data.urgency,
      bodyPart: data.bodyPart || 'Não especificado',
      specialtyRequired: data.specialtyRequired,
      price: data.price,
      clinicId: patient.clinicId,
      clinicName: patient.clinic.name,
      status: 'Disponível',
      paymentStatus: 'Pendente',
      accessionNumber: `ACC-${Date.now().toString().slice(-6)}`,
      dicomUrl,
      studyInstanceUID: extractedStudyUID,
      examImageUrl: examImageUrl || '/placeholder-medical.png',
    };
    console.log('Exam data to create:', examData);

    const newExam = await prisma.exam.create({
      data: examData
    });

    console.log('✅ Exam created successfully:', newExam.id);
    res.status(201).json(newExam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Zod validation error:', error.issues);
      return res.status(400).json({ error: error.issues });
    }
    console.error('❌ Unexpected error creating exam:');
    console.error('Error name:', (error as any).name);
    console.error('Error message:', (error as any).message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Erro ao criar exame', details: (error as any).message });
  }
};

export const acceptExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const userId = user?.userId;

    console.log(`[acceptExam] Attempting to accept exam ${id} by user ${userId}`);

    if (!userId) {
      console.log('[acceptExam] No userId in request');
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Fetch user from DB to get the correct name
    console.log('[acceptExam] Fetching user from DB...');
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) {
      console.log('[acceptExam] User not found in DB');
      return res.status(404).json({ error: 'Usuário médico não encontrado' });
    }
    console.log(`[acceptExam] User found: ${dbUser.name} (${dbUser.role})`);

    // FIND DOCTOR ENTITY
    // Fix for 500 Error: User.id (Auth) != Doctor.id (Business Entity).
    console.log('[acceptExam] Finding linked Doctor profile...');
    const doctor = await prisma.doctor.findFirst({ where: { name: dbUser.name } });

    if (!doctor) {
      console.error(`[acceptExam] CRITICAL: No Doctor profile found for user ${dbUser.name}`);
      return res.status(404).json({ error: 'Perfil de médico não encontrado. Entre em contato com o suporte.' });
    }
    console.log(`[acceptExam] Doctor profile found: ${doctor.id}`);

    console.log('[acceptExam] Fetching exam...');
    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      console.log('[acceptExam] Exam not found');
      return res.status(404).json({ error: 'Exame não encontrado' });
    }
    console.log(`[acceptExam] Exam status: ${exam.status}`);

    if (exam.status !== 'Disponível') {
      console.log('[acceptExam] Exam not available');
      return res.status(400).json({ error: 'Exame não está mais disponível' });
    }

    console.log('[acceptExam] Updating exam...');
    const updatedExam = await prisma.exam.update({
      where: { id: id as string },
      data: {
        status: 'Aguardando Laudo',
        doctorAssignedId: doctor.id,
        doctorAssignedName: doctor.name
      }
    });
    console.log('[acceptExam] Exam updated successfully');

    res.json(updatedExam);
  } catch (error) {
    console.error('[acceptExam] DATA ERROR:', error);
    if (error instanceof Error) {
      console.error('[acceptExam] Error message:', error.message);
      console.error('[acceptExam] Stack:', error.stack);
    }
    res.status(500).json({ error: 'Erro ao aceitar exame', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const completeReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { finalReport } = req.body;

    const updatedExam = await prisma.exam.update({
      where: { id: id as string },
      data: {
        status: 'Concluído',
        finalReport
      }
    });

    res.json(updatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao concluir laudo' });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { examType, modality, urgency, bodyPart, specialtyRequired, price } = req.body;

    console.log('📝 Updating exam:', id);

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      console.log('❌ Exam not found');
      return res.status(404).json({ error: 'Exame não encontrado' });
    }

    // Only allow updates if exam is not completed
    if (exam.status === 'Concluído') {
      return res.status(400).json({ error: 'Não é possível editar exames concluídos' });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        ...(examType && { examType }),
        ...(modality && { modality }),
        ...(urgency && { urgency }),
        ...(bodyPart && { bodyPart }),
        ...(specialtyRequired && { specialtyRequired }),
        ...(price !== undefined && { price: Number(price) }),
      }
    });

    console.log('✅ Exam updated successfully');
    res.json(updatedExam);
  } catch (error) {
    console.error('❌ Error updating exam:', error);
    res.status(500).json({ error: 'Erro ao atualizar exame', details: (error as any).message });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting exam:', id);

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      console.log('❌ Exam not found');
      return res.status(404).json({ error: 'Exame não encontrado' });
    }

    // Only allow deletion if exam is not completed
    if (exam.status === 'Concluído') {
      return res.status(400).json({ error: 'Não é possível deletar exames concluídos' });
    }

    await prisma.exam.delete({ where: { id } });

    console.log('✅ Exam deleted successfully');
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting exam:', error);
    res.status(500).json({ error: 'Erro ao deletar exame', details: (error as any).message });
  }
};

export const payExam = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'clinic' && role !== 'admin') {
      return res.status(403).json({ error: 'Apenas clínicas podem liberar pagamentos.' });
    }

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: { paymentStatus: 'Pago' }
    });

    res.json(updatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
};
