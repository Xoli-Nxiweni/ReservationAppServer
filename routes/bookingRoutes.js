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
  cancelAdminBooking
} from '../controllers/BookingController.js';
import authenticateUser from '../middleware/authenticateUser.js';


const router = express.Router();

// Wrap async route handlers to handle promises correctly
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware to check admin role
const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// User Booking Routes
router.get('/bookings', authenticateUser, asyncHandler(getUserBookings));
router.post('/bookings', authenticateUser, asyncHandler(createUserBooking));
router.get('/bookings/:id', authenticateUser, asyncHandler(getBookingById));
router.put('/bookings/:id', authenticateUser, asyncHandler(updateBooking));
router.delete('/bookings/:id', authenticateUser, asyncHandler(cancelBooking));

// Admin Booking Routes
router.get('/admin/bookings', 
  authenticateUser, 
  checkAdminRole, 
  asyncHandler(getAllBookings)
);
router.get('/admin/bookings/:id', 
  authenticateUser, 
  checkAdminRole, 
  asyncHandler(getAdminBookingById)
);
router.put('/admin/bookings/:id', 
  authenticateUser, 
  checkAdminRole, 
  asyncHandler(updateAdminBooking)
);
router.delete('/admin/bookings/:id', 
  authenticateUser, 
  checkAdminRole, 
  asyncHandler(cancelAdminBooking)
);

export default router;