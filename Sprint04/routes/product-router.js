import express from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/product-controller.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/products', authenticate, createProduct);
router.put('/products/:id', authenticate, updateProduct);
router.delete('/products/:id', authenticate, deleteProduct);
export default router;
