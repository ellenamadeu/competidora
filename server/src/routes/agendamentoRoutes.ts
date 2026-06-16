import { Router } from 'express';
import { AgendamentoController } from '../controllers/AgendamentoController';

const router = Router();

router.get('/', AgendamentoController.listarPorData);
router.post('/', AgendamentoController.criar);
router.put('/:id', AgendamentoController.atualizar);
router.delete('/:id', AgendamentoController.excluir);
router.post('/toggle-status', AgendamentoController.alternarStatus);
router.get('/opcoes', AgendamentoController.buscarOpcoes);
router.get('/pedido/:id_pedido', AgendamentoController.listarPorPedido);

export default router;
