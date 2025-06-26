import express from 'express';
import { createProduct } from '../controllers/product-controller.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/products', authenticate, createProduct);

export default router;
