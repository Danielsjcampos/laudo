import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const ClinicCreateSchema = z.object({
  name: z.string().min(3),
  location: z.string().min(3),
  adminEmail: z.string().email(),
  monthlyFee: z.number().min(0),
});

export const getClinics = async (req: Request, res: Response) => {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { joinedDate: 'desc' }
    });
    res.json(clinics);
  } catch (error) {
    console.error('[Clinics] Fetch error:', error);
    res.status(500).json({ error: 'Erro ao buscar clínicas' });
  }
};

export const createClinic = async (req: Request, res: Response) => {
  try {
    const data = ClinicCreateSchema.parse(req.body);

    // Check if admin email already exists
    const existing = await prisma.clinic.findUnique({
      where: { adminEmail: data.adminEmail }
    });

    if (existing) {
      return res.status(400).json({ error: 'E-mail de administrador já está em uso por outra unidade' });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name: data.name,
        location: data.location,
        adminEmail: data.adminEmail,
        monthlyFee: data.monthlyFee,
        subscriptionStatus: 'Ativa'
      }
    });

    // Also create a user for this clinic if it doesn't exist
    const userExists = await prisma.user.findUnique({ where: { email: data.adminEmail } });
    if (!userExists) {
      await prisma.user.create({
        data: {
          email: data.adminEmail,
          name: data.name,
          role: 'clinic',
          password: 'password123' // Default password for new units
        }
      });
    }

    res.status(201).json(clinic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('[Clinics] Create error:', error);
    res.status(500).json({ error: 'Erro ao criar unidade' });
  }
};
