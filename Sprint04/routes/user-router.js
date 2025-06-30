import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import {
  getUserProfile,
  updateUserProfile,
  getMyProducts,
} from '../controllers/user-controller.js';

const router = express.Router();

router.get('/users/me', authenticate, getUserProfile);
router.put('/users/me', authenticate, updateUserProfile);
router.get('/users/me/products', authenticate, getMyProducts);

export default router;