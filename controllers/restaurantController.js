import Restaurant from '../models/Restaurant.js';
import Reservation from '../models/Reservation.js';
import Review from '../models/Review.js';

// Get all restaurants
export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
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
    res.status(500).json({ message: 'Error fetching restaurant' });
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
    res.status(400).json({ message: 'Error creating restaurant' });
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
    res.status(400).json({ message: 'Error updating available slots' });
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

    const slotAvailable = restaurant.availableSlots.some(slot => 
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
    res.status(400).json({ message: 'Error creating reservation' });
  }
};

// Get user's reservations
export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling reservation' });
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
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    restaurant.averageRating = averageRating;
    restaurant.totalReviews = reviews.length;
    await restaurant.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review' });
  }
};

// Get reviews for a restaurant
export const getReviewsForRestaurant = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'fullNames');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};