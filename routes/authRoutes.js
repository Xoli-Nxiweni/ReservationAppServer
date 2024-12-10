import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../utils/errorHandler.js';

const router = express.Router();

// Register endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

// Get user profile endpoint
router.get('/profile', authenticateToken, getProfile);

export default router;