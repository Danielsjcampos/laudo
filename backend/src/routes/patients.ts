import { Router } from 'express';
import { getPatients, createPatient, updatePatient } from '../controllers/patientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getPatients);
router.post('/', createPatient);
router.patch('/:id', updatePatient);

export default router;
