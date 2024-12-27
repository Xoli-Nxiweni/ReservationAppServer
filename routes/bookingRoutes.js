import express from 'express';
import { 
  getUserBookings, 
  createUserBooking, 
  getBookingById, 
  updateBooking, 
  cancelBooking,
  getAllBookings,
  getAdminBookingById,
  updateAdminBooking,
  cancelAdminBooking,
  getBookingWithDetails,
  // sendBookingEmail
} from '../controllers/BookingController.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// User Booking Routes
router.get('/', authenticateUser, asyncHandler(getUserBookings));
router.get('/bookings/:id', authenticateUser, asyncHandler(getBookingWithDetails));
router.post('/', authenticateUser, asyncHandler(createUserBooking));
router.put('/:id', authenticateUser, asyncHandler(updateBooking));
router.delete('/:id', authenticateUser, asyncHandler(cancelBooking));
router.get('/:id', authenticateUser, asyncHandler(getBookingById));
// router.get('/send-email/:id', authenticateUser, asyncHandler(sendBookingEmail));

// Admin Booking Routes
router.get('/admin/bookings', authenticateUser, checkAdminRole, asyncHandler(getAllBookings));
router.get('/admin/bookings/:id', authenticateUser, checkAdminRole, asyncHandler(getAdminBookingById));
router.put('/admin/bookings/:id', authenticateUser, checkAdminRole, asyncHandler(updateAdminBooking));
router.delete('/admin/bookings/:id', authenticateUser, checkAdminRole, asyncHandler(cancelAdminBooking));

export default router;