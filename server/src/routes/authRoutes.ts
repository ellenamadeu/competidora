import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.get('/me', authMiddleware as any, AuthController.me);

export default router;
