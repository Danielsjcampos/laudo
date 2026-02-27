import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Erro ao buscar médicos' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, crm, chatSearchable } = req.body;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(specialty && { specialty }),
        ...(crm && { crm }),
        ...(chatSearchable !== undefined && { chatSearchable }),
        ...(req.body.sendReadReceipts !== undefined && { sendReadReceipts: req.body.sendReadReceipts })
      }
    });
    
    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Erro ao atualizar médico' });
  }
});

export default router;
