import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';

const router = Router();

router.get('/', PedidoController.list);
router.post('/', PedidoController.create);
router.get('/pagamentos/metodos', PedidoController.listPaymentMethods);
router.get('/config/entregas', PedidoController.listDeliveryMethods);
router.post('/calcular', PedidoController.calculate);
router.get('/tracking/:id', PedidoController.getTrackingById);

router.get('/:id', PedidoController.getById);
router.put('/:id', PedidoController.update);

// Itens
router.post('/:id/itens', PedidoController.addItem);
router.put('/:id/itens/:itemId', PedidoController.updateItem);
router.delete('/:id/itens/:itemId', PedidoController.deleteItem);

// Pagamentos
router.post('/:id/pagamentos', PedidoController.addPayment);
router.put('/:id/pagamentos/:idPagamento', PedidoController.updatePayment);
router.delete('/:id/pagamentos/:idPagamento', PedidoController.deletePayment);

export default router;
