import { Router } from 'express';
import { saveMessage, getMessages, archiveConversation, getContacts, getArchivedConversations } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMessages);
router.post('/', saveMessage);
router.get('/contacts', getContacts);
router.post('/archive', archiveConversation);
router.get('/archives', getArchivedConversations);

export default router;
