
import { Router } from 'express';
import { getExams, createExam, acceptExam, completeReport, updateExam, deleteExam, payExam } from '../controllers/examController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken); // Todas as rotas de exames requerem autenticação

router.get('/', getExams);
router.post('/', upload.single('dicom'), createExam);
router.patch('/:id', updateExam);
router.delete('/:id', deleteExam);
router.post('/:id/accept', acceptExam);
router.post('/:id/complete', completeReport);
router.post('/:id/pay', payExam);

export default router;
