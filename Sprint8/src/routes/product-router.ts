import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from '../controllers/product-controller';
import { getLikedProducts } from '../controllers/like-controller';
import authenticate from '../middlewares/authenticate';

const router = express.Router();
router.get('/products/liked', authenticate, getLikedProducts);
router.post('/products', authenticate, createProduct);
router.put('/products/:id', authenticate, updateProduct);
router.delete('/products/:id', authenticate, deleteProduct);
router.get('/products/:id', authenticate, getProductById);

export default router;