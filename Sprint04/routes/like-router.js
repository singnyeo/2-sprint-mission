import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import { toggleProductLike, toggleArticleLike, } from '../controllers/like-controller.js';

const router = express.Router();

router.post('/products/:id/like', authenticate, toggleProductLike);
router.post('/articles/:id/like', authenticate, toggleArticleLike);
export default router;