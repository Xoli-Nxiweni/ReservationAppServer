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
  const { booking, amount, paymentMethod, transactionId } = req.body;
  console.log('Xolis bookiings', booking)

  try {

    if (!booking || !amount || !paymentMethod || !transactionId) {
      throw { message: 'All fields (booking, amount, paymentMethod, transactionId) are required', status: 400 };
    }

    // Validate booking
    const bookingRecord = await Booking.findById(booking);
    if (!bookingRecord) {
      console.error(`Booking not found for ID: ${booking}`);
      throw { message: 'Booking not found', status: 404 };
    }

    // Ensure the payment is for the correct user
    if (bookingRecord.user.toString() !== req.user.id) {
      console.error(`Unauthorized access for booking ID: ${booking} by user ID: ${req.user.id}`);
      throw { message: 'Unauthorized: Booking does not belong to you', status: 403 };
    }

    // Validate restaurant
    const restaurant = await Restaurant.findById(bookingRecord.restaurant);
    if (!restaurant) {
      console.error(`Restaurant not found for booking ID: ${booking}`);
      throw { message: 'Restaurant not found', status: 404 };
    }

    // Create a new payment record
    const newPayment = new Payment({
      user: req.user.id,
      booking: bookingRecord._id,
      restaurant: bookingRecord.restaurant,
      amount,
      paymentMethod,
      transactionId,
    });

    await newPayment.save();

    // Update booking status to 'paid'
    bookingRecord.status = 'paid';
    await bookingRecord.save();

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

    console.log('Populated Payments:', payments); // Log the fetched payments

    if (payments.length === 0) {
      console.warn('No payments found in the database.'); // Log a warning if payments array is empty
    }

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error); // Log detailed error information
    handleError(res, error);
  }
};

// Admin: Get a single payment by ID
export const getAdminPaymentById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking', 'date time')
      .populate('restaurant', 'name') // Populate restaurant name
      .exec();

    if (!payment) {
      throw { message: 'Payment not found', status: 404 };
    }

    res.json(payment);
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: Update payment status (e.g., mark as refunded or failed)
export const updateAdminPaymentStatus = async (req, res) => {
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  const { status } = req.body;
  if (!status) {
    return handleError(res, { message: 'Status is required to update payment', status: 400 });
  }

  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw { message: 'Payment not found', status: 404 };
    }

    payment.status = status;
    await payment.save();

    res.json({ message: 'Payment status updated', payment });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin: Delete a payment record
export const deleteAdminPayment = async (req, res) => {
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      throw { message: 'Payment not found', status: 404 };
    }

    // Use deleteOne() or findByIdAndDelete() to delete the payment
    await Payment.deleteOne({ _id: req.params.id }); // Option 1: deleteOne()
    // await Payment.findByIdAndDelete(req.params.id); // Option 2: findByIdAndDelete()

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
