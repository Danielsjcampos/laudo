
import { Router } from 'express';
import { getPatients, createPatient } from '../controllers/patientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getPatients);
router.post('/', createPatient);

export default router;
