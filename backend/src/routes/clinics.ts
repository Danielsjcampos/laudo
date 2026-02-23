import { Router } from 'express';
import { getClinics, createClinic } from '../controllers/clinicController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getClinics);
router.post('/', createClinic);

export default router;
