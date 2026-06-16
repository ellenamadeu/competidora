import { Router } from 'express';
import { CaixaController } from '../controllers/CaixaController';

const router = Router();

router.get('/stats', CaixaController.getStats);

export default router;
