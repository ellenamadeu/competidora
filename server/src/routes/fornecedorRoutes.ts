import { Router } from 'express';
import { FornecedorController } from '../controllers/FornecedorController';

const router = Router();

router.get('/', FornecedorController.list);
router.get('/categorias', FornecedorController.listCategories);
router.post('/categorias', FornecedorController.createCategory);
router.get('/:id', FornecedorController.getById);
router.post('/', FornecedorController.create);
router.put('/:id', FornecedorController.update);
router.delete('/:id', FornecedorController.delete);

export default router;
