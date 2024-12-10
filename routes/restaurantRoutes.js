import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurantSlots,
  createReservation,
  getUserReservations,
  cancelReservation,
  addReview,
  getReviewsForRestaurant,
} from '../controllers/restaurantController.js';
import { authenticateToken } from '../utils/errorHandler.js';

const router = express.Router();

// Get all restaurants
router.get('/', getAllRestaurants);

// Get restaurant by ID
router.get('/:id', getRestaurantById);

// Create a new restaurant (admin only)
router.post('/', authenticateToken, createRestaurant);

// Update restaurant's available slots (restaurant owner only)
router.put('/:id/slots', authenticateToken, updateRestaurantSlots);

// Create a new reservation
router.post('/reservations', authenticateToken, createReservation);

// Get user's reservations
router.get('/reservations', authenticateToken, getUserReservations);

// Cancel a reservation
router.delete('/reservations/:id', authenticateToken, cancelReservation);

// Add a review for a restaurant
router.post('/:id/reviews', authenticateToken, addReview);

// Get reviews for a restaurant
router.get('/:id/reviews', getReviewsForRestaurant);

export default router;