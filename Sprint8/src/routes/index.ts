import express from 'express';
import authRouter from './auth-router';
import productRouter from './product-router';
import articleRouter from './article-router';
import userRouter from './user-router';
import likeRouter from './like-router';

const router = express.Router();

router.use(authRouter);
router.use(productRouter);
router.use(articleRouter);
router.use(userRouter);
router.use(likeRouter);

export default router;