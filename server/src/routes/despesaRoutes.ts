import { Router } from 'express';
import { DespesaController } from '../controllers/DespesaController';

const router = Router();

router.get('/', DespesaController.list);
router.get('/categorias', DespesaController.listCategories);
router.get('/:id', DespesaController.getById);
router.post('/', DespesaController.create);
router.put('/:id', DespesaController.update);
router.delete('/:id', DespesaController.delete);

export default router;
