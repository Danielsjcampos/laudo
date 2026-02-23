
import { Router } from 'express';
import { verifyCRM } from '../controllers/crmController';

const router = Router();

router.get('/verify-crm', verifyCRM);

export default router;
