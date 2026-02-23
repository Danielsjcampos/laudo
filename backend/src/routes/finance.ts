
import { Router } from 'express';
import { FinancialController } from '../controllers/FinancialController';

const router = Router();

// Dashboard Summary
router.get('/dashboard', FinancialController.getDashboardStats);

// Monthly/Weekly Reports
// router.get('/reports', FinancialController.getReports);

export default router;
