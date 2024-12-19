// // // // import express from 'express';
// // // // import {
// // // //   getAllRestaurants,
// // // //   getRestaurantById,
// // // //   createRestaurant,
// // // //   updateRestaurantSlots,
// // // //   createReservation,
// // // //   getUserReservations,
// // // //   cancelReservation,
// // // //   addReview,
// // // //   getReviewsForRestaurant,
// // // // } from '../controllers/restaurantController.js';
// // // // import { authenticateToken } from '../utils/errorHandler.js';

// // // // const router = express.Router();

// // // // // Get all restaurants
// // // // router.get('/', getAllRestaurants);

// // // // // Get restaurant by ID
// // // // router.get('/:id', getRestaurantById);

// // // // // Create a new restaurant (admin only)
// // // // router.post('/', authenticateToken, createRestaurant);

// // // // // Update restaurant's available slots (restaurant owner only)
// // // // router.put('/:id/slots', authenticateToken, updateRestaurantSlots);

// // // // // Create a new reservation
// // // // router.post('/reservations', authenticateToken, createReservation);

// // // // // Get user's reservations
// // // // router.get('/reservations', authenticateToken, getUserReservations);

// // // // // Cancel a reservation
// // // // router.delete('/reservations/:id', authenticateToken, cancelReservation);

// // // // // Add a review for a restaurant
// // // // router.post('/:id/reviews', authenticateToken, addReview);

// // // // // Get reviews for a restaurant
// // // // router.get('/:id/reviews', getReviewsForRestaurant);

// // // // export default router;

// // // import express from 'express';
// // // import { body, validationResult } from 'express-validator'; // For input validation
// // // import rateLimit from 'express-rate-limit'; // For rate limiting
// // // import {
// // //   getAllRestaurants,
// // //   getRestaurantById,
// // //   createRestaurant,
// // //   updateRestaurantSlots,
// // //   createReservation,
// // //   getUserReservations,
// // //   cancelReservation,
// // //   addReview,
// // //   getReviewsForRestaurant,
// // // } from '../controllers/restaurantController.js';
// // // import { authenticateToken } from '../utils/errorHandler.js';

// // // const router = express.Router();

// // // // Rate limiter for creating reviews
// // // const reviewLimiter = rateLimit({
// // //   windowMs: 60 * 60 * 1000, // 1 hour
// // //   max: 5, // Limit each user to 5 reviews per hour
// // //   message: 'Too many reviews submitted, please try again later.'
// // // });

// // // // Get all restaurants
// // // router.get('/', getAllRestaurants);

// // // // Get restaurant by ID
// // // router.get('/:id', getRestaurantById);

// // // // Create a new restaurant (admin only)
// // // router.post(
// // //   '/',
// // //   authenticateToken,
// // //   body('name').notEmpty().withMessage('Name is required'),
// // //   body('location').notEmpty().withMessage('Location is required'),
// // //   body('cuisine').notEmpty().withMessage('Cuisine is required'),
// // //   body('availableSlots').isArray().withMessage('Available slots must be an array'),
// // //   body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
// // //   (req, res, next) => {
// // //     const errors = validationResult(req);
// // //     if (!errors.isEmpty()) {
// // //       return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
// // //     }
// // //     next();
// // //   },
// // //   createRestaurant
// // // );

// // // // Update restaurant's available slots (restaurant owner only)
// // // router.put(
// // //   '/:id/slots',
// // //   authenticateToken,
// // //   body('availableSlots').isArray().withMessage('Available slots must be an array'),
// // //   (req, res, next) => {
// // //     const errors = validationResult(req);
// // //     if (!errors.isEmpty()) {
// // //       return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
// // //     }
// // //     next();
// // //   },
// // //   updateRestaurantSlots
// // // );

// // // // Create a new reservation
// // // router.post(
// // //   '/reservations',
// // //   authenticateToken,
// // //   body('restaurantId').notEmpty().withMessage('Restaurant ID is required'),
// // //   body('date').isISO8601().withMessage('Date must be in ISO 8601 format'),
// // //   body('time').notEmpty().withMessage('Time is required'),
// // //   body('guests').isInt({ min: 1 }).withMessage('Number of guests must be a positive integer'),
// // //   (req, res, next) => {
// // //     const errors = validationResult(req);
// // //     if (!errors.isEmpty()) {
// // //       return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
// // //     }
// // //     next();
// // //   },
// // //   createReservation
// // // );

// // // // Get user's reservations
// // // router.get('/reservations', authenticateToken, getUserReservations);

// // // // Cancel a reservation (soft delete)
// // // router.put('/reservations/:id/cancel', authenticateToken, cancelReservation);

// // // // Add a review for a restaurant
// // // router.post(
// // //   '/:id/reviews',
// // //   authenticateToken,
// // //   reviewLimiter,
// // //   body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
// // //   body('comment').notEmpty().withMessage('Comment is required'),
// // //   (req, res, next) => {
// // //     const errors = validationResult(req);
// // //     if (!errors.isEmpty()) {
// // //       return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
// // //     }
// // //     next();
// // //   },
// // //   addReview
// // // );

// // // // Get reviews for a restaurant
// // // router.get('/:id/reviews', getReviewsForRestaurant);

// // // export default router;

// // // import express from 'express';
// // // import {
// // //   getAllRestaurants,
// // //   getRestaurantById,
// // //   createRestaurant,
// // //   updateRestaurantSlots,
// // //   createReservation,
// // //   getUserReservations,
// // //   cancelReservation,
// // //   addReview,
// // //   getReviewsForRestaurant,
// // // } from '../controllers/restaurantController.js';
// // // import { authenticateToken } from '../utils/errorHandler.js';

// // // const router = express.Router();

// // // // Get all restaurants
// // // router.get('/', getAllRestaurants);

// // // // Get restaurant by ID
// // // router.get('/:id', getRestaurantById);

// // // // Create a new restaurant (admin only)
// // // router.post('/', authenticateToken, createRestaurant);

// // // // Update restaurant's available slots (restaurant owner only)
// // // router.put('/:id/slots', authenticateToken, updateRestaurantSlots);

// // // // Create a new reservation
// // // router.post('/reservations', authenticateToken, createReservation);

// // // // Get user's reservations
// // // router.get('/reservations', authenticateToken, getUserReservations);

// // // // Cancel a reservation (soft delete)
// // // router.put('/reservations/:id/cancel', authenticateToken, cancelReservation);

// // // // Add a review for a restaurant
// // // router.post('/:id/reviews', authenticateToken, addReview);

// // // // Get reviews for a restaurant
// // // router.get('/:id/reviews', getReviewsForRestaurant);

// // // export default router;

// // // import express from 'express';
// // // import {
// // //   getAllRestaurants,
// // //   getRestaurantById,
// // //   createRestaurant,
// // //   updateRestaurantSlots,
// // //   createReservation,
// // //   getUserReservations,
// // //   cancelReservation,
// // //   addReview,
// // //   getReviewsForRestaurant,
// // // } from '../controllers/restaurantController.js'
// // // import { authenticateUser } from '../middleware/authenticateUser.js'; // Ensure the correct middleware is used

// // // const router = express.Router();

// // // // Public Routes

// // // // Get all restaurants
// // // router.get('/', getAllRestaurants);

// // // // Get restaurant by ID
// // // router.get('/:id', getRestaurantById);

// // // // Get reviews for a restaurant
// // // router.get('/:id/reviews', getReviewsForRestaurant);

// // // // Protected Routes (Require Authentication)

// // // // Create a new restaurant (admin only)
// // // router.post('/', authenticateUser, createRestaurant);

// // // // Update restaurant's available slots (restaurant owner only)
// // // router.put('/:id/slots', authenticateUser, updateRestaurantSlots);

// // // // Create a new reservation
// // // router.post('/reservations', authenticateUser, createReservation);

// // // // Get user's reservations
// // // router.get('/reservations', authenticateUser, getUserReservations);

// // // // Cancel a reservation (soft delete)
// // // router.put('/reservations/:id/cancel', authenticateUser, cancelReservation);

// // // // Add a review for a restaurant
// // // router.post('/:id/reviews', authenticateUser, addReview);

// // // export default router;

// // import express from 'express';
// // import {
// //   getAllRestaurants,
// //   getRestaurantById,
// //   createRestaurant,
// //   updateRestaurantSlots,
// //   createReservation,
// //   getUserReservations,
// //   cancelReservation,
// //   addReview,
// //   getReviewsForRestaurant,
// // } from '../controllers/restaurantController.js';
// // import authenticateUser from '../middleware/authenticateUser.js'; // Use default import

// // const router = express.Router();

// // // Public Routes

// // // Get all restaurants
// // router.get('/', getAllRestaurants);

// // // Get restaurant by ID
// // router.get('/:id', getRestaurantById);

// // // Get reviews for a restaurant
// // router.get('/:id/reviews', getReviewsForRestaurant);

// // // Protected Routes (Require Authentication)

// // // Create a new restaurant (admin only)
// // router.post('/', authenticateUser, createRestaurant);

// // // Update restaurant's available slots (restaurant owner only)
// // router.put('/:id/slots', authenticateUser, updateRestaurantSlots);

// // // Create a new reservation
// // router.post('/reservations', authenticateUser, createReservation);

// // // Get user's reservations
// // router.get('/reservations', authenticateUser, getUserReservations);

// // // Cancel a reservation (soft delete)
// // router.put('/reservations/:id/cancel', authenticateUser, cancelReservation);

// // // Add a review for a restaurant
// // router.post('/:id/reviews', authenticateUser, addReview);

// // export default router;

// import express from 'express';
// import multer from 'multer'; // Import multer
// import {
//   getAllRestaurants,
//   getRestaurantById,
//   createRestaurant,
//   updateRestaurantSlots,
//   createReservation,
//   getUserReservations,
//   cancelReservation,
//   addReview,
//   getReviewsForRestaurant,
//   uploadImage, // Import the uploadImage controller
// } from '../controllers/restaurantController.js';
// import authenticateUser from '../middleware/authenticateUser.js';

// const router = express.Router();

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Save files in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname); // Rename file with timestamp
//   },
// });

// const upload = multer({ storage });

// // Public Routes

// // Get all restaurants
// router.get('/', getAllRestaurants);

// // Get restaurant by ID
// router.get('/:id', getRestaurantById);

// // Get reviews for a restaurant
// router.get('/:id/reviews', getReviewsForRestaurant);

// // Protected Routes (Require Authentication)

// // Create a new restaurant (admin only)
// router.post('/', authenticateUser, createRestaurant);

// // Update restaurant's available slots (restaurant owner only)
// router.put('/:id/slots', authenticateUser, updateRestaurantSlots);

// // Create a new reservation
// router.post('/reservations', authenticateUser, createReservation);

// // Get user's reservations
// router.get('/reservations', authenticateUser, getUserReservations);

// // Cancel a reservation (soft delete)
// router.put('/reservations/:id/cancel', authenticateUser, cancelReservation);

// // Add a review for a restaurant
// router.post('/:id/reviews', authenticateUser, addReview);

// // Upload an image (e.g., for a restaurant)
// router.post('/upload', authenticateUser, upload.single('image'), uploadImage);

// export default router;

import express from 'express';
import multer from 'multer'; // Import multer
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  createReservation,
  getUserReservations,
  cancelReservation,
  addReview,
  getReviewsForRestaurant,
  uploadImage, // Import the uploadImage controller
} from '../controllers/restaurantController.js';
import authenticateUser from '../middleware/authenticateUser.js';
import cors from 'cors';
// import express from 'express';
const app = express();
app.use(cors());


const router = express.Router();

// Configure Multer for file storage
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage }).single('image'); // Ensure 'image' matches the client-side field name

// Upload route
router.post('/upload', upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Received file:', req.file);
  res.json({ url: `http:///localhost:4050/uploads/${req.file.filename}` });
});


// const upload = multer({ storage });

// Public Routes

// Get all restaurants
router.get('/', getAllRestaurants);

// Get restaurant by ID
router.get('/:id', getRestaurantById);

// Get reviews for a restaurant
router.get('/:id/reviews', getReviewsForRestaurant);

// Protected Routes (Require Authentication)

// Create a new restaurant (admin only)
router.post('/', authenticateUser, createRestaurant);

// Update restaurant's available slots (restaurant owner only)
// router.put('/:id/slots', authenticateUser, updateRestaurantSlots);

// Create a new reservation
router.post('/reservations', authenticateUser, createReservation);

// Get user's reservations
router.get('/reservations', authenticateUser, getUserReservations);

// Cancel a reservation (soft delete)
router.put('/reservations/:id/cancel', authenticateUser, cancelReservation);

// Add a review for a restaurant
router.post('/:id/reviews', authenticateUser, addReview);

// Upload an image (e.g., for a restaurant)
// router.post('/upload', authenticateUser, upload.single('image'), uploadImage);

router.post('/upload', upload, (req, res) => {
  console.log('Received file:', req.file); // Log the file object
  console.log('Received fields:', req.body); // Log other fields
  res.json({ url: 'http://example.com/uploads/' + req.file.filename });
});

export default router;