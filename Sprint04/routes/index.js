import express from 'express';
import authRouter from './auth-router.js';
import productRouter from './product-router.js';


const router = express.Router();

router.use(authRouter);
router.use(productRouter);


export default router;