import { Router, Response } from 'express';
import { MessageModel } from '../models/Message';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get recent messages (requires authentication)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const messages = await MessageModel.getRecent(limit);

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get all messages (requires authentication)
router.get('/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await MessageModel.getAll();

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
