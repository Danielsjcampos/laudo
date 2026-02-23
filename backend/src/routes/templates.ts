
import { Router } from 'express';
import { PreReportTemplateController } from '../controllers/PreReportTemplateController';

const router = Router();

router.get('/', PreReportTemplateController.list);
router.post('/', PreReportTemplateController.create);
router.put('/:id', PreReportTemplateController.update);
router.delete('/:id', PreReportTemplateController.delete);
router.get('/catalog', PreReportTemplateController.getCatalog);
router.post('/seed', PreReportTemplateController.seed);

export default router;
