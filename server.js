import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import multer from 'multer';


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Routes
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/bookings', bookingRoutes)
app.use('/payment', paymentRoutes);



// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({ storage }).single('image'); // Ensure 'image' matches the client-side field name

// Upload route
app.post('/upload', upload, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Received file:', req.file);
  res.json({ url: `http://example.com/uploads/${req.file.filename}` });
});



// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 4050;

console.log("🔄 Server connecting...");

const server = app.listen(PORT, (error) => {
  if (error) {
    console.error("❌ Something went wrong with the port:", PORT);
  } else {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  }
});

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("❗ Uncaught Exception:", err.message);
  process.exit(1); // Optional: Exit the process if needed
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
  // Optional: Handle the rejection (e.g., log it, shut down gracefully)
});


// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    console.log('🛑 Server has been shut down');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1));
});