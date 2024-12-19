import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import getPagination from '../utils/pagination.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from 'cloudinary'


// At the top of your restaurantController.js
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use path.join with process.cwd() to get the correct absolute path
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'uploads');
//     fs.mkdirSync(uploadDir, { recursive: true });
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   }
// });

// export const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// });

// Error handler
const handleError = (res, error) => {
  console.error(error.message);
  res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: limitPerPage } = getPagination(page, limit);
    
    const restaurants = await Restaurant.find()
      .skip(skip)
      .limit(limitPerPage)
      .sort('-averageRating');

    const total = await Restaurant.countDocuments();

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limitPerPage),
      currentPage: parseInt(page)
    });
  } catch (error) {
    handleError(res, { message: 'Error fetching restaurants', status: 500 });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }
    res.json(restaurant);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new restaurant (admin only)
export const createRestaurant = async (req, res) => {
  if (req.user.role !== 'admin') {
    return handleError(res, { message: 'Unauthorized: Admin access required', status: 403 });
  }

  const { name, location, cuisine, capacity, price } = req.body;

  if (!name || !location || !cuisine || !capacity || !price) {
    return handleError(res, { message: 'All fields are required', status: 400 });
  }

  try {
    const imageUrl = req.file ? 
      `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : '';

    const restaurant = new Restaurant({
      name,
      image: imageUrl,
      location,
      cuisine,
      capacity,
      price,
      user: req.user.id
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    handleError(res, { message: 'Error creating restaurant', status: 400 });
  }
};

// Add this function in the restaurantController.js file, right after the multer configuration
// and before getAllRestaurants

// Controller for handling image uploads
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      throw { message: 'No file uploaded', status: 400 };
    }

    const result = await cloudinary.uploader.upload(req.file.path,
      {
        width: 500,
        height: 500,
        crop: 'fill',
      }
    ) 

    // Return the URL of the uploaded file
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    handleError(res, error);
  }
};


// Create a new reservation
export const createReservation = async (req, res) => {
  const { restaurantId, date, time, guests } = req.body;

  if (!restaurantId || !date || !time || !guests) {
    return handleError(res, { message: 'All fields are required', status: 400 });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }



    // Create reservation and update capacity atomically
    const session = await Restaurant.startSession();
    session.startTransaction();

    try {
      const reservation = new Reservation({
        user: req.user.id,
        restaurant: restaurantId,
        date,
        time,
        guests
      });
      await reservation.save({ session });

      await Restaurant.updateOne(
        { 
          _id: restaurantId,
          '.date': date,
          '.times': time
        },
        { $inc: { '.$.capacity': -guests } },
        { session }
      );

      await session.commitTransaction();
      res.status(201).json(reservation);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Get user's reservations with pagination
export const getUserReservations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: limitPerPage } = getPagination(page, limit);

  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location image')
      .skip(skip)
      .limit(limitPerPage)
      .sort('-date');

    const total = await Reservation.countDocuments({ user: req.user.id });

    res.json({
      reservations,
      totalPages: Math.ceil(total / limitPerPage),
      currentPage: parseInt(page)
    });
  } catch (error) {
    handleError(res, { message: 'Error fetching reservations', status: 500 });
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res) => {
  try {
    const session = await Reservation.startSession();
    session.startTransaction();

    try {
      const reservation = await Reservation.findOne({ 
        _id: req.params.id,
        user: req.user.id,
        status: { $ne: 'cancelled' }
      });

      if (!reservation) {
        throw { message: 'Reservation not found or already cancelled', status: 404 };
      }

      reservation.status = 'cancelled';
      await reservation.save({ session });

      await Restaurant.updateOne(
        {
          _id: reservation.restaurant,
          '.date': reservation.date,
          '.times': reservation.time
        },
        { $inc: { '.$.capacity': reservation.guests } },
        { session }
      );

      await session.commitTransaction();
      res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Add a review for a restaurant
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const restaurantId = req.params.id;

  if (!rating || !comment) {
    return handleError(res, { message: 'Rating and comment are required', status: 400 });
  }

  try {
    const [restaurant, existingReview] = await Promise.all([
      Restaurant.findById(restaurantId),
      Review.findOne({ user: req.user.id, restaurant: restaurantId })
    ]);

    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }

    if (existingReview) {
      throw { message: 'You have already reviewed this restaurant', status: 400 };
    }

    const session = await Review.startSession();
    session.startTransaction();

    try {
      const review = await Review.create([{
        user: req.user.id,
        restaurant: restaurantId,
        rating,
        comment
      }], { session });

      const stats = await Review.aggregate([
        { $match: { restaurant: restaurant._id } },
        { 
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ]).session(session);

      await Restaurant.findByIdAndUpdate(
        restaurantId,
        {
          averageRating: Number(stats[0].averageRating.toFixed(1)),
          totalReviews: stats[0].totalReviews
        },
        { session }
      );

      await session.commitTransaction();
      res.status(201).json(review[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Get reviews for a restaurant with pagination
export const getReviewsForRestaurant = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { skip, limit: limitPerPage } = getPagination(page, limit);

  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'fullName')
      .skip(skip)
      .limit(limitPerPage)
      .sort('-createdAt');

    const total = await Review.countDocuments({ restaurant: req.params.id });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limitPerPage),
      currentPage: parseInt(page)
    });
  } catch (error) {
    handleError(res, { message: 'Error fetching reviews', status: 500 });
  }
};