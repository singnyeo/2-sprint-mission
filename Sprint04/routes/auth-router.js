import express from 'express';
import {register, login, refreshTokens, logout } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login',  login);
router.post('/auth/refresh', refreshTokens);
router.post('/auth/logout', logout);
export default router;
