import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';
import authenticateUser from '../middleware/authenticateUser.js';
import getPagination from '../utils/pagination.js';

// Error handler
const handleError = (res, error) => {
  console.error(error.message);
  res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
};

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
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

  const { name, image, location, cuisine, availableSlots, capacity } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
      image,
      location,
      cuisine,
      availableSlots,
      capacity,
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    handleError(res, { message: 'Error creating restaurant', status: 400 });
  }
};

// Update restaurant's available slots (restaurant owner only)
export const updateRestaurantSlots = async (req, res) => {
  if (req.user.role !== 'restaurant') {
    return handleError(res, { message: 'Unauthorized: Restaurant owner access required', status: 403 });
  }

  const { availableSlots } = req.body;

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { availableSlots },
      { new: true }
    );

    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }

    res.json(restaurant);
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new reservation
export const createReservation = async (req, res) => {
  const { restaurantId, date, time, guests } = req.body;

  try {
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

    const newReservation = new Reservation({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      time,
      guests,
    });

    await newReservation.save();

    // Update slot capacity
    await Restaurant.updateOne(
      { _id: restaurantId, 'availableSlots.date': date, 'availableSlots.times': time },
      { $inc: { 'availableSlots.$.capacity': -guests } }
    );

    res.status(201).json(newReservation);
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
      .populate('restaurant', 'name location')
      .skip(skip)
      .limit(limitPerPage);

    const totalReservations = await Reservation.countDocuments({ user: req.user.id });

    res.json({
      reservations,
      totalPages: Math.ceil(totalReservations / limitPerPage),
      currentPage: page,
    });
  } catch (error) {
    handleError(res, { message: 'Error fetching reservations', status: 500 });
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!reservation) {
      throw { message: 'Reservation not found', status: 404 };
    }

    res.json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// Add a review for a restaurant
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw { message: 'Restaurant not found', status: 404 };
    }

    const reviewExists = await Review.findOne({ user: req.user.id, restaurant: restaurantId });
    if (reviewExists) {
      throw { message: 'You have already reviewed this restaurant', status: 400 };
    }

    const newReview = new Review({
      user: req.user.id,
      restaurant: restaurantId,
      rating,
      comment,
    });

    await newReview.save();

    // Update restaurant's average rating and review count
    const reviews = await Review.find({ restaurant: restaurantId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      averageRating,
      totalReviews: reviews.length,
    });

    res.status(201).json(newReview);
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
      .populate('user', 'fullNames')
      .skip(skip)
      .limit(limitPerPage);

    const totalReviews = await Review.countDocuments({ restaurant: req.params.id });

    res.json({
      reviews,
      totalPages: Math.ceil(totalReviews / limitPerPage),
      currentPage: page,
    });
  } catch (error) {
    handleError(res, { message: 'Error fetching reviews', status: 500 });
  }
};