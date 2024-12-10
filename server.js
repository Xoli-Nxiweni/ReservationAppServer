import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection configuration
const mongoDBConnectionString = process.env.MONGO_URI;
const mongoConnectionOptions = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Mongoose Schemas and Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullNames: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  availableSlots: [{
    date: { type: Date, required: true },
    times: [{ type: String, required: true }]
  }],
  capacity: { type: Number, required: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

const reservationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10 
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled'], 
    default: 'confirmed' 
  }
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  comment: { 
    type: String, 
    required: true,
    trim: true 
  }
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Review = mongoose.model('Review', reviewSchema);

// Authentication Routes
// Register endpoint
app.post('/auth/register', async (req, res) => {
  const { email, fullNames, password, phone, address } = req.body;

  if (!email || !fullNames || !password || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      fullNames, 
      password: hashedPassword, 
      phone, 
      address 
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(`❌ Registration Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user._id, 
      email: user.email,
      role: user.role 
    }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(`❌ Login Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile endpoint
app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      email: user.email, 
      fullNames: user.fullNames, 
      phone: user.phone, 
      address: user.address 
    });
  } catch (error) {
    console.error(`❌ Error fetching user profile: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Restaurant Routes
// Get all restaurants
app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

// Get restaurant by ID
app.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant' });
  }
});

// Create a new restaurant (admin only)
app.post('/restaurants', authenticateToken, async (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }

  const { name, location, cuisine, availableSlots, capacity } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
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
});

// Reservation Routes
// Create a new reservation
app.post('/reservations', authenticateToken, async (req, res) => {
  const { restaurantId, date, time, guests } = req.body;
  
  try {
    // Check restaurant availability
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Validate time slot
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
});

// Get user's reservations
app.get('/reservations', authenticateToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id })
      .populate('restaurant', 'name location');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Cancel a reservation
app.delete('/reservations/:id', authenticateToken, async (req, res) => {
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
});

// Review Routes
// Add a review for a restaurant
app.post('/restaurants/:id/reviews', authenticateToken, async (req, res) => {
  const { rating, comment } = req.body;
  const restaurantId = req.params.id;

  try {
    // Validate restaurant exists
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

    // Update restaurant's average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    restaurant.averageRating = averageRating;
    restaurant.totalReviews = reviews.length;
    await restaurant.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review' });
  }
});

// Get reviews for a restaurant
app.get('/restaurants/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'fullNames');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// MongoDB connection function
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDBConnectionString, mongoConnectionOptions);
    console.log(`✅ MongoDB connected successfully`);
    console.log(`🌐 Cluster: ${mongoose.connection.host}`);
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Server startup function
const startServer = async () => {
  try {
    await connectToMongoDB();

    const PORT = process.env.PORT || 4050;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Server Startup Error: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();