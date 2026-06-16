import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';

const router = Router();

router.get('/', ClienteController.list);
router.get('/:id', ClienteController.getById);
router.post('/', ClienteController.create);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.delete);

export default router;
