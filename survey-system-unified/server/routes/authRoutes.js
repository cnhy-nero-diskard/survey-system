// routes/authRoutes.js
import express from 'express';
import { login, registerAdmin, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { verifyHMAC } from '../middleware/hmacMiddleware.js'; // Import HMAC middleware
import { checkAuth } from '../controllers/authController.js';
const router = express.Router();

router.post('/api/auth/login', login);
router.get('/api/auth/logout', authenticate, logout);
router.post('/api/auth/register-admin', verifyHMAC, registerAdmin); // Apply HMAC middleware
router.get('/api/auth/check', checkAuth);


export default router;