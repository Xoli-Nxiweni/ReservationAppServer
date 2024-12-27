import express from 'express';
import {
  createPayment,
  getUserPayments,
  getPaymentById,
  getAllPayments,
  deleteAdminPayment,
} from '../controllers/paymentController.js';
import authenticateUser from '../middleware/authenticateUser.js';
import cors from 'cors';
// import express from 'express';
const app = express();
app.use(cors());


const router = express.Router();

// User Routes
router.post('/pay', authenticateUser, createPayment);
router.get('/pay', authenticateUser, getUserPayments);
router.get('/pay/:id', authenticateUser, getPaymentById);

// Admin Routes
router.get('/admin/payments', authenticateUser, getAllPayments);
router.delete('/admin/payments/:id', authenticateUser, deleteAdminPayment);

export default router;