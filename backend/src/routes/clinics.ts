import { Router } from 'express';
import { getClinics, createClinic } from '../controllers/clinicController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getClinics);
router.post('/', createClinic);

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, adminEmail, chatSearchable } = req.body;
    
    // Quick inline import just for this route to avoid messing with clinicController right now
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
        ...(adminEmail && { adminEmail }),
        ...(chatSearchable !== undefined && { chatSearchable })
      }
    });

    res.json(clinic);
  } catch (error) {
    console.error('Error updating clinic:', error);
    res.status(500).json({ error: 'Erro ao atualizar clínica' });
  }
});

export default router;
