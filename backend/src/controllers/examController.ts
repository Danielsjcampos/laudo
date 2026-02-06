import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { processDicomFile } from '../services/dicomService';
import path from 'path';
import fs from 'fs';

const logFile = path.join(process.cwd(), 'debug-backend.log');
const log = (msg: string, obj?: any) => {
  const timestamp = new Date().toISOString();
  const message = `${timestamp} - ${msg} ${obj ? JSON.stringify(obj, null, 2) : ''}\n`;
  fs.appendFileSync(logFile, message);
  console.log(msg, obj || '');
};

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
      exams = await prisma.exam.findMany({
        where: { clinicId: clinic?.id },
        orderBy: { dateRequested: 'desc' }
      });
    } else if (role === 'doctor') {
      // Return assigned exams OR available exams (Marketplace)
      exams = await prisma.exam.findMany({
        where: {
          OR: [
            { doctorAssignedId: userId },
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
    log('📥 Received exam creation request');
    log('Body:', req.body);
    log('File:', req.file ? { filename: req.file.filename, size: req.file.size } : 'No file');

    const data = ExamCreateSchema.parse(req.body);
    log('✅ Schema validation passed', data);

    const file = req.file;

    // Find patient and clinic
    log('🔍 Looking for patient:', data.patientId);
    const patient = await prisma.patient.findUnique({ where: { id: data.patientId }, include: { clinic: true } });
    if (!patient) {
      log('❌ Patient not found');
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    log('✅ Patient found:', patient.name);

    let dicomUrl = null;
    let examImageUrl = null;
    let extractedPatientName = patient.name;

    if (file) {
      log('📁 Processing DICOM file:', file.filename);
      dicomUrl = `/uploads/dicom/${file.filename}`;
      const previewDir = path.join(process.cwd(), 'uploads', 'previews');

      try {
        const result = await processDicomFile(file.path, previewDir);
        examImageUrl = result.previewUrl;
        if (result.metadata.patientName && result.metadata.patientName !== 'Não identificado') {
          extractedPatientName = result.metadata.patientName;
        }
        log('✅ DICOM processed successfully');
      } catch (procError) {
        log('⚠️ DICOM processing failed, but continuing', procError);
      }
    }

    log('💾 Creating exam in database...');
    const examData = {
      patientId: data.patientId,
      patientName: String(extractedPatientName),
      examType: data.examType,
      modality: data.modality,
      urgency: data.urgency,
      bodyPart: data.bodyPart || 'Não especificado',
      specialtyRequired: data.specialtyRequired,
      price: data.price,
      clinicId: patient.clinicId,
      clinicName: patient.clinic?.name || 'Clínica Desconhecida',
      status: 'Disponível',
      paymentStatus: 'Pendente',
      accessionNumber: `ACC-${Date.now().toString().slice(-6)}`,
      dicomUrl,
      examImageUrl: examImageUrl || '/placeholder-medical.png',
    };
    log('Exam data to create:', examData);

    const newExam = await prisma.exam.create({
      data: examData
    });

    log('✅ Exam created successfully:', newExam.id);
    res.status(201).json(newExam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      log('❌ Zod validation error:', error.issues);
      return res.status(400).json({ error: 'Erro de validação nos dados enviados', details: error.issues });
    }

    log('❌ Unexpected error creating exam:', error);

    res.status(500).json({
      error: 'Erro interno ao criar exame',
      message: (error as any).message,
      code: (error as any).code || 'UNKNOWN_ERROR',
      stack: process.env.NODE_ENV === 'development' ? (error as any).stack : undefined
    });
  }
};

export const acceptExam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const userId = user?.userId;
    const name = user?.name;

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) return res.status(404).json({ error: 'Exame não encontrado' });
    if (exam.status !== 'Disponível') return res.status(400).json({ error: 'Exame não está mais disponível' });

    const updatedExam = await prisma.exam.update({
      where: { id: id as string },
      data: {
        status: 'Aguardando Laudo',
        doctorAssignedId: userId as string,
        doctorAssignedName: name as string
      }
    });

    res.json(updatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao aceitar exame' });
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
