import { Router } from 'express';
import { FuncionarioController } from '../controllers/FuncionarioController';

const router = Router();

router.get('/', FuncionarioController.list);
router.get('/:id', FuncionarioController.getById);
router.post('/', FuncionarioController.create);
router.put('/:id', FuncionarioController.update);
router.delete('/:id', FuncionarioController.delete);

// Rotas de Salário
router.get('/:id/salarios', FuncionarioController.listSalaries);
router.post('/:id/salarios', FuncionarioController.createSalaryRecord);
router.post('/salarios/:idSalario/itens', FuncionarioController.addSalaryItem);
router.delete('/salarios-itens/:itemId', FuncionarioController.deleteSalaryItem);

export default router;
