import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error.message);
    res.status(500).json({ message: 'Error fetching restaurants', details: error.message });
  }
};

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error.message);
    res.status(500).json({ message: 'Error fetching restaurant', details: error.message });
  }
};

// Create a new restaurant (admin only)
export const createRestaurant = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  const { name, image, location, cuisine, availableSlots, capacity } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
      image,
      location,
      cuisine,
      availableSlots,
      capacity
    });

    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error.message);
    res.status(400).json({ message: 'Error creating restaurant', details: error.message });
  }
};

// Update restaurant's available slots (restaurant owner only)
export const updateRestaurantSlots = async (req, res) => {
  if (req.user.role !== 'restaurant') {
    return res.status(403).json({ message: 'Unauthorized: Restaurant owner access required' });
  }

  const { availableSlots } = req.body;

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { availableSlots },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error updating available slots:', error.message);
    res.status(400).json({ message: 'Error updating available slots', details: error.message });
  }
};

// Create a new reservation
export const createReservation = async (req, res) => {
  const { restaurantId, date, time, guests } = req.body;
  
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const slotAvailable = restaurant.availableSlots.some(
      slot =>
        slot.date.toDateString() === new Date(date).toDateString() &&
        slot.times.includes(time)
    );

    if (!slotAvailable) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }

    const newReservation = new Reservation({
      user: req.user.id,
      restaurant: restaurantId,
      date,
      time,
      guests
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error.message);
    res.status(400).json({ message: 'Error creating reservation', details: error.message });
  }
};

// Get user's reservations
export const getUserReservations = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalReservations = await Reservation.countDocuments({ user: req.user.id });

    res.status(200).json({
      reservations,
      totalPages: Math.ceil(totalReservations / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching reservations:', error.message);
    res.status(500).json({ message: 'Error fetching reservations', details: error.message });
  }
};

// Cancel a reservation (soft delete)
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' }, // Mark as cancelled
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error.message);
    res.status(500).json({ message: 'Error cancelling reservation', details: error.message });
  }
};

// Add a review for a restaurant
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const restaurantId = req.params.id;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const newReview = new Review({
      user: req.user.id,
      restaurant: restaurantId,
      rating,
      comment
    });

    await newReview.save();

    const reviews = await Review.find({ restaurant: restaurantId });
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    restaurant.averageRating = averageRating;
    restaurant.totalReviews = reviews.length;
    await restaurant.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error.message);
    res.status(400).json({ message: 'Error creating review', details: error.message });
  }
};

// Get reviews for a restaurant
export const getReviewsForRestaurant = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'fullNames')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ restaurant: req.params.id });

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Error fetching reviews', details: error.message });
  }
};