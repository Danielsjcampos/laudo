
import { Router } from 'express';
import { PricingController } from '../controllers/PricingController';
import { SettingsController } from '../controllers/SettingsController';

const router = Router();

// Pricing
router.get('/', PricingController.getPrices);
router.get('/calculate', PricingController.getPriceByModality);
router.post('/update', PricingController.updatePrice);
router.delete('/:modality', PricingController.deleteModality);

// Global Settings
router.get('/settings', SettingsController.getSettings);
router.post('/settings', SettingsController.updateSettings);

export default router;
