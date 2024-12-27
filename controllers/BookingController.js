import Booking from '../models/Booking.js';
import Restaurant from '../models/Restaurant.js';
import getPagination from '../utils/pagination.js';

// Utility function to validate booking availability
const validateBookingAvailability = async (restaurantId, date, time, guests) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw { message: 'Restaurant not found', status: 404 };
  }
  return restaurant;
};

// User Booking Controllers

// Fetch bookings for the user
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitPerPage } = getPagination(page, limit);

    // Find bookings for the logged-in user
    const bookings = await Booking.find({ user: req.user.id })
      .populate('restaurant', 'name location')
      .skip(skip)
      .limit(limitPerPage)
      .sort({ createdAt: -1 });

    // Get total count of bookings for pagination
    const totalBookings = await Booking.countDocuments({ user: req.user.id });

    res.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limitPerPage),
      currentPage: Number(page),
      totalBookings
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error fetching user bookings:", error);
  }
};

// Create a booking for the user
export const createUserBooking = async (req, res) => {
  try {
    const { restaurantId, date, time, guests, attachments } = req.body;

    // Validate booking availability (restaurant exists)
    const restaurant = await validateBookingAvailability(restaurantId, date, time, guests);

    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      time,
      guests,
      attachments: attachments || [],
      status: 'confirmed'
    });

    const savedBooking = await newBooking.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error creating booking:", error);
  }
};

// Fetch booking with details (by bookingId)
export const getBookingWithDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('restaurant', 'name location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error fetching booking with details:", error);
  }
};

// Fetch a booking by ID, ensuring the user is authorized
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('restaurant', 'name location address')
      .populate('user', 'fullNames email');

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Authorization check
    if (String(booking.user._id) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to access this booking', status: 403 };
    }

    res.json(booking);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error fetching booking by ID:", error);
  }
};

// Update booking details
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Authorization check
    if (String(booking.user) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to update this booking', status: 403 };
    }

    // Allowed fields for update
    const allowedUpdates = ['date', 'time', 'guests', 'attachments'];
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
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error updating booking:", error);
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    // Authorization check
    if (String(booking.user) !== req.user.id && req.user.role !== 'admin') {
      throw { message: 'Unauthorized to cancel this booking', status: 403 };
    }

    // Prevent cancelling already cancelled bookings
    if (booking.status === 'cancelled') {
      throw { message: 'Booking is already cancelled', status: 400 };
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error cancelling booking:", error);
  }
};

// Admin Booking Controllers

// Fetch all bookings (admin only)
export const getAllBookings = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  try {
    const { page = 1, limit = 10, status, restaurantId } = req.query;
    const { skip, limit: limitPerPage } = getPagination(page, limit);

    // Build filter based on query params
    const filter = {};
    if (status) filter.status = status;
    if (restaurantId) filter.restaurant = restaurantId;

    console.log('Filter:', filter); // Log the filter object
    console.log('Skip:', skip, 'Limit:', limitPerPage); // Log pagination values

    const bookings = await Booking.find(filter)
      .populate('user', 'fullNames email')
      .populate('restaurant', 'name location')
      .skip(skip)
      .limit(limitPerPage)
      .sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments(filter);

    console.log('Bookings:', bookings); // Log the fetched bookings

    res.json({
      bookings,
      totalPages: Math.ceil(totalBookings / limitPerPage),
      currentPage: Number(page),
      totalBookings
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error fetching all bookings:", error);
  }
};

// Admin fetch booking by ID
export const getAdminBookingById = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
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
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error fetching admin booking by ID:", error);
  }
};

// Admin update booking
export const updateAdminBooking = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

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
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error updating admin booking:", error);
  }
};

// Admin cancel booking
export const cancelAdminBooking = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      throw { message: 'Booking not found', status: 404 };
    }

    if (booking.status === 'cancelled') {
      throw { message: 'Booking is already cancelled', status: 400 };
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
    console.error("Error cancelling admin booking:", error);
  }
};


//currently not in use
// export const SendBookingIdToUser = async (req, res) => {
  //   try {
    //     const booking = await Booking.findById(req.params.id).populate('user', 'email');
    
    //     if (!booking) {
      //       throw { message: 'Booking not found', status: 404 };
      //     }
      
      //     // Assuming you have a function to send emails
      //     await sendEmail({
        //       to: booking.user.email,
        //       subject: 'Your Booking ID',
        //       text: `Your booking ID is: ${booking._id}`
        //     });
        
        //     // Respond after the email is sent successfully
        //     res.status(200).json({ message: 'Booking ID sent to user' });
        //   } catch (error) {
          //     res.status(error.status || 500).json({ message: error.message });
          //     console.error("Error sending booking ID to user:", error);
          //   }
          // };
          
          
          //currently not in use
          // import { createTransport } from 'nodemailer';
          
          // const transporter = createTransport({
            //   service: 'gmail',
            //   auth: {
              //     user: 'asiphilexoli@gmail.com',
              //     pass: 'caga xtli ceyr rwye',
//   },
// });


//currently not in use
// const sendBookingEmail = async (bookingId, userEmail) => {
//   const mailOptions = {
//     from: 'Zesty Reserve <asiphilexoli@gmail.com>',
//     to: userEmail,
//     subject: 'Your Booking ID',
//     html: `
//       <h3 style="color: #4A90E2;">🌟 Booking Confirmation 🌟</h3>
//       <p>Your booking ID is: ${bookingId}</p>
//       <p>Thank you for choosing Zesty Reserve!</p>
//     `
//   };

//    const SendBookingIdToUser = async (req, res) => {
//     try {
//       const { email } = req.body;
//       await sendBookingEmail(req.params.id, email);
//       res.status(200).json({ message: 'Booking ID sent to user' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }

//   await transporter.sendMail(mailOptions);
// };

// export default sendBookingEmail;