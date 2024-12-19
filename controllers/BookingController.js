import Booking from '../models/Booking.js';
import Restaurant from '../models/Restaurant.js';
import handleError from '../utils/errorHandler.js';
import getPagination from '../utils/pagination.js';


// Utility function to validate booking availability
const validateBookingAvailability = async (restaurantId, date, time, guests) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw { message: 'Restaurant not found', status: 404 };
  }

  const slot = restaurant.availableSlots.find(
    slot => slot.date.toDateString() === new Date(date).toDateString() && slot.times.includes(time)
  );

  if (!slot || slot.capacity < guests) {
    throw { message: 'Selected time slot is not available', status: 400 };
  }

  return restaurant;
};

// User Booking Controllers
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitPerPage } = getPagination(page, limit);

    const bookings = await Booking.find({ user: req.user.id })
      .populate('restaurant', 'name location')
      .skip(skip)
      .limit(limitPerPage)
      .sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments({ user: req.user.id });

    res.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limitPerPage),
      currentPage: Number(page),
      totalBookings
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createUserBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, guests, attachments } = req.body;

    // Validate booking availability
    const restaurant = await validateBookingAvailability(restaurantId, date, time, guests);

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      time,
      guests,
      attachments: attachments || [],
      status: 'confirmed'
    });

    await newBooking.save();

    // Update slot capacity
    await Restaurant.updateOne(
      { _id: restaurantId, 'availableSlots.date': date, 'availableSlots.times': time },
      { $inc: { 'availableSlots.$.capacity': -guests } }
    );

    res.status(201).json(newBooking);
  } catch (error) {
    handleError(res, error);
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('restaurant', 'name location address')
      .populate('user', 'fullNames email');

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Check authorization
    if (String(booking.user._id) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to access this booking', status: 403 };
    }

    res.json(booking);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Check authorization
    if (String(booking.user) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to update this booking', status: 403 };
    }

    // Prevent updating certain fields
    const allowedUpdates = ['date', 'time', 'guests', 'attachments'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If updating booking details, validate availability
    if (updates.date || updates.time || updates.guests) {
      await validateBookingAvailability(
        booking.restaurant, 
        updates.date || booking.date, 
        updates.time || booking.time, 
        updates.guests || booking.guests
      );
    }

    Object.assign(booking, updates);
    await booking.save();

    res.json(booking);
  } catch (error) {
    handleError(res, error);
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Check authorization
    if (String(booking.user) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to cancel this booking', status: 403 };
    }

    // Prevent cancelling already cancelled bookings
    if (booking.status === 'cancelled') {
      throw { message: 'Booking is already cancelled', status: 400 };
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore restaurant slot capacity
    await Restaurant.updateOne(
      { _id: booking.restaurant, 'availableSlots.date': booking.date, 'availableSlots.times': booking.time },
      { $inc: { 'availableSlots.$.capacity': booking.guests } }
    );

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    handleError(res, error);
  }
};

// Admin Booking Controllers
export const getAllBookings = async (req, res) => {
  // Admin authorization check
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const { page = 1, limit = 10, status, restaurantId } = req.query;
    const { skip, limit: limitPerPage } = getPagination(page, limit);

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (restaurantId) filter.restaurant = restaurantId;

    const bookings = await Booking.find(filter)
      .populate('user', 'fullNames email')
      .populate('restaurant', 'name location')
      .skip(skip)
      .limit(limitPerPage)
      .sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments(filter);

    res.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limitPerPage),
      currentPage: Number(page),
      totalBookings
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAdminBookingById = async (req, res) => {
  // Admin authorization check
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'fullNames email')
      .populate('restaurant', 'name location address');

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    res.json(booking);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateAdminBooking = async (req, res) => {
  // Admin authorization check
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Allow admin to update more fields
    const allowedUpdates = ['date', 'time', 'guests', 'status', 'attachments'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(booking, updates);
    await booking.save();

    res.json(booking);
  } catch (error) {
    handleError(res, error);
  }
};

export const cancelAdminBooking = async (req, res) => {
  // Admin authorization check
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Prevent cancelling already cancelled bookings
    if (booking.status === 'cancelled') {
      throw { message: 'Booking is already cancelled', status: 400 };
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore restaurant slot capacity
    await Restaurant.updateOne(
      { _id: booking.restaurant, 'availableSlots.date': booking.date, 'availableSlots.times': booking.time },
      { $inc: { 'availableSlots.$.capacity': booking.guests } }
    );

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    handleError(res, error);
  }
};