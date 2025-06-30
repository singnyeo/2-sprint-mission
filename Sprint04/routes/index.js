import express from 'express';
import authRouter from './auth-router.js';
import productRouter from './product-router.js';
import articleRouter from './article-router.js';

const router = express.Router();

router.use(authRouter);
router.use(productRouter);
router.use(articleRouter);

export default router;