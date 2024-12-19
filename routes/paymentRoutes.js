import express from 'express';
import {
  createPayment,
  getUserPayments,
  getPaymentById,
  getAllPayments,
} from '../controllers/paymentController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

// User Routes
router.post('/pay', authenticateUser, createPayment);
router.get('/pay', authenticateUser, getUserPayments);
router.get('/pay/:id', authenticateUser, getPaymentById);

// Admin Routes
router.get('/admin/payments', authenticateUser, getAllPayments);

export default router;