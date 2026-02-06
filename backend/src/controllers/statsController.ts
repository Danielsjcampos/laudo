// @ts-nocheck

import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const role = user?.role;
    const email = user?.email;
    const name = user?.name;
    console.log(`📊 Stats Request: Role=${role}, Email=${email}`);

    if (role === 'admin') {
      const stats = await prisma.globalStats.findFirst();
      return res.json(stats || {
        activeClinics: 0,
        totalDoctors: 0,
        totalExamsProcessed: 0,
        totalRevenue: 0,
        platformProfit: 0,
        totalTransferred: 0
      });
    } else if (role === 'clinic') {
      const clinic = await prisma.clinic.findFirst({ 
          where: { adminEmail: email },
          include: { 
              patients: { take: 5, orderBy: { id: 'desc' } },
              exams: { take: 5, orderBy: { dateRequested: 'desc' } }
          }
      });
      return res.json(clinic || { name: 'Clínica não encontrada', patients: [], exams: [] });
    } else if (role === 'doctor') {
        const doctor = await prisma.doctor.findFirst({ where: { name: (req as any).user.name } });
        return res.json({
            activeExams: await prisma.exam.count({ where: { status: 'Disponível' } }),
            assignedExams: await prisma.exam.count({ where: { doctorAssignedId: doctor?.id || 'none' } }),
            completedExams: await prisma.exam.count({ where: { doctorAssignedId: doctor?.id || 'none', status: 'Concluído' } }),
            rating: doctor?.rating || 0
        });
    }

    res.json({ message: 'Sem estatísticas disponíveis para este perfil', activeClinics: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
};
