import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { upload } from '../config/multer';

const router = Router();

router.get('/', ProdutoController.list);
router.get('/:id', ProdutoController.getById);
router.post('/', ProdutoController.create);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);
router.post('/upload', upload.single('image'), ProdutoController.uploadImage);

export default router;
