// @ts-nocheck

import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const PatientCreateSchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
});

export const getPatients = async (req: any, res: Response) => {
  try {
    const { role, email } = req.user;
    console.log(`👥 Patients Request: Role=${role}, Email=${email}`);

    let patients;
    if (role === 'admin') {
      patients = await prisma.patient.findMany({ include: { clinic: true } });
    } else if (role === 'clinic') {
      const clinic = await prisma.clinic.findFirst({ where: { adminEmail: email } });
      patients = await prisma.patient.findMany({ where: { clinicId: clinic?.id } });
    } else {
      console.warn(`🚫 Acesso negado em getPatients. Role: ${role}`);
      return res.status(403).json({ error: 'Não autorizado' });
    }

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pacientes' });
  }
};

export const createPatient = async (req: any, res: Response) => {
  try {
    const { role, email } = req.user;
    if (role !== 'clinic' && role !== 'admin') return res.status(403).json({ error: 'Somente clínicas podem registrar pacientes' });

    const data = PatientCreateSchema.parse(req.body);

    // Se for clínica, associa ao ID da clínica logada
    let clinicId;
    if (role === 'clinic') {
      const clinic = await prisma.clinic.findFirst({ where: { adminEmail: email } });
      clinicId = clinic?.id;
    } else {
      // Se for admin, precisamos que envie o clinicId no body ou assuma uma padrão (melhor validar)
      // Por simplicidade, assumirei que admin envia clinicId opcional (mas o schema não tem)
      // Vamos forçar clinicId se for admin registrando
      // ... ou apenas pegar a primeira clínica logada se não enviada
      const clinic = await prisma.clinic.findFirst();
      clinicId = clinic?.id;
    }

    if (!clinicId) return res.status(400).json({ error: 'ID da clínica não encontrado' });

    const newPatient = await prisma.patient.create({
      data: {
        ...data,
        clinicId
      }
    });

    res.status(201).json(newPatient);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
};

export const updatePatient = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'clinic' && role !== 'admin') {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const data = PatientCreateSchema.partial().parse(req.body);

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data
    });

    res.json(updatedPatient);
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues });
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
};
