import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Restaurant from '../models/Restaurant.js';


// Error handler
const handleError = (res, error) => {
  console.error(error.message);
  res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
};

// Create a new payment
export const createPayment = async (req, res) => {
  const { bookingId, amount, paymentMethod, transactionId } = req.body;

  try {
    // Validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      throw { message: 'Unauthorized: Booking does not belong to you', status: 403 };
    }

    // Fetch the restaurant ID from the booking
    const restaurant = await Restaurant.findById(booking.restaurant);
    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }

    // Create payment
    const newPayment = new Payment({
      user: req.user.id,
      booking: bookingId,
      restaurant: booking.restaurant, // Include restaurant ID
      amount,
      paymentMethod,
      transactionId,
    });

    await newPayment.save();

    // Update booking status to "paid"
    booking.status = 'paid';
    await booking.save();

    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all payments for the authenticated user
export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking', 'date time')
      .populate('restaurant', 'name') // Populate restaurant name
      .sort('-createdAt');

    res.json(payments);
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking', 'date time')
      .populate('restaurant', 'name') // Populate restaurant name
      .exec();

    if (!payment) {
      throw { message: 'Payment not found', status: 404 };
    }

    // Check if the payment belongs to the user
    if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to access this payment', status: 403 };
    }

    res.json(payment);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: Get all payments
export const getAllPayments = async (req, res) => {
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const payments = await Payment.find()
      .populate('user', 'email')
      .populate('booking', 'date time')
      .populate('restaurant', 'name') // Populate restaurant name
      .sort('-createdAt');

    res.json(payments);
  } catch (error) {
    handleError(res, error);
  }
};