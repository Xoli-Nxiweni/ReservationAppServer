// // // import express from 'express';
// // // import mongoose from 'mongoose';
// // // import dotenv from 'dotenv';
// // // import admin from 'firebase-admin';
// // // import cors from 'cors';
// // // import fs from 'fs';
// // // import path from 'path';
// // // import { fileURLToPath } from 'url';

// // // // Resolve current module's directory
// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // // // Load environment variables
// // // dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // // // Initialize Express app
// // // const app = express();
// // // app.use(express.json());
// // // app.use(cors());

// // // // MongoDB Connection Configuration
// // // const mongoDBConnectionString = process.env.MONGO_URI
// // // const mongoConnectionOptions = {
// // //   autoIndex: true,
// // //   serverSelectionTimeoutMS: 5000,
// // //   socketTimeoutMS: 45000,
// // // };

// // // // MongoDB Connection with Enhanced Logging and Error Handling
// // // async function connectToMongoDB() {
// // //   try {
// // //     await mongoose.connect(mongoDBConnectionString, mongoConnectionOptions);
// // //     console.log('✅ MongoDB connected successfully');
// // //     console.log(`🌐 Connected to cluster: ${mongoose.connection.host}`);
// // //     console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
// // //   } catch (error) {
// // //     console.error('❌ MongoDB Connection Error:', {
// // //       message: error.message,
// // //       name: error.name,
// // //     });
// // //     process.exit(1);
// // //   }
// // // }

// // // // MongoDB Connection Event Listeners
// // // mongoose.connection.on('disconnected', () => {
// // //   console.warn('⚠️ MongoDB disconnected');
// // // });

// // // mongoose.connection.on('reconnected', () => {
// // //   console.log('🔄 MongoDB reconnected');
// // // });

// // // // Initialize Firebase Admin
// // // function initializeFirebaseAdmin() {
// // //   try {
// // //     const serviceAccountPath = path.resolve(__dirname, 'config', 'reservation-app-2d5fd-firebase-adminsdk-kmo76-f950e60f12.json');
// // //     const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// // //     admin.initializeApp({
// // //       credential: admin.credential.cert(serviceAccount),
// // //     });

// // //     console.log('🔥 Firebase Admin initialized successfully');
// // //   } catch (error) {
// // //     console.error('❌ Firebase Admin Initialization Error:', error);
// // //     process.exit(1);
// // //   }
// // // }

// // // // MongoDB User Schema
// // // const userSchema = new mongoose.Schema({
// // //   email: { 
// // //     type: String, 
// // //     required: true, 
// // //     unique: true 
// // //   },
// // //   name: { 
// // //     type: String, 
// // //     required: true 
// // //   },
// // //   firebaseUid: { 
// // //     type: String, 
// // //     required: true, 
// // //     unique: true 
// // //   },
// // //   createdAt: { 
// // //     type: Date, 
// // //     default: Date.now 
// // //   }
// // // });

// // // const User = mongoose.model('User', userSchema);

// // // // Google OAuth Authentication Endpoint
// // // app.post('/auth/google', async (req, res) => {
// // //   const { idToken } = req.body;

// // //   if (!idToken) {
// // //     return res.status(400).json({ message: 'ID Token is required' });
// // //   }

// // //   try {
// // //     // Verify Google ID Token with Firebase Admin SDK
// // //     const decodedToken = await admin.auth().verifyIdToken(idToken);
// // //     const { email, name, uid } = decodedToken;

// // //     // Find or create user in MongoDB
// // //     let user = await User.findOne({ firebaseUid: uid });
    
// // //     if (!user) {
// // //       user = new User({ 
// // //         email, 
// // //         name, 
// // //         firebaseUid: uid 
// // //       });
// // //       await user.save();
// // //       console.log(`🆕 New user created: ${email}`);
// // //     }

// // //     res.status(200).json(user);
// // //   } catch (error) {
// // //     console.error('❌ Authentication Error:', error);
// // //     res.status(401).json({ 
// // //       message: 'Authentication failed', 
// // //       error: error.message 
// // //     });
// // //   }
// // // });

// // // // Get User Profile Endpoint
// // // app.get('/profile', async (req, res) => {
// // //     const { idToken } = req.headers;
  
// // //     if (!idToken) {
// // //       return res.status(400).json({ message: 'ID Token is required' });
// // //     }
  
// // //     try {
// // //       // Verify the Firebase ID Token
// // //       const decodedToken = await admin.auth().verifyIdToken(idToken);
// // //       const firebaseUid = decodedToken.uid;
  
// // //       // Find the user in MongoDB based on their Firebase UID
// // //       const user = await User.findOne({ firebaseUid });
  
// // //       if (!user) {
// // //         return res.status(404).json({ message: 'User not found' });
// // //       }
  
// // //       // Return the user profile data
// // //       res.status(200).json(user);
// // //     } catch (error) {
// // //       console.error('❌ Error fetching user profile:', error);
// // //       res.status(401).json({
// // //         message: 'Authentication failed',
// // //         error: error.message,
// // //       });
// // //     }
// // //   });
  

// // // // Server Startup Function
// // // async function startServer() {
// // //   try {
// // //     await connectToMongoDB();
// // //     initializeFirebaseAdmin();

// // //     const PORT = process.env.PORT || 5000;
// // //     app.listen(PORT, () => {
// // //       console.log(`🚀 Server running on http://localhost:${PORT}`);
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Server Startup Error:', error);
// // //     process.exit(1);
// // //   }
// // // }

// // // // Start the server
// // // startServer();

// // import express from 'express';
// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import cors from 'cors';
// // import bcrypt from 'bcrypt';
// // import jwt from 'jsonwebtoken';
// // import path from 'path';
// // import { fileURLToPath } from 'url';
// // import { type } from 'os';

// // // Resolve current module's directory
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // // Load environment variables
// // dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // // Initialize Express app
// // const app = express();
// // app.use(express.json());
// // app.use(cors());

// // // MongoDB Connection Configuration
// // const mongoDBConnectionString = process.env.MONGO_URI;
// // const mongoConnectionOptions = {
// //   autoIndex: true,
// //   serverSelectionTimeoutMS: 5000,
// //   socketTimeoutMS: 45000,
// // };

// // // MongoDB Connection with Enhanced Logging and Error Handling
// // async function connectToMongoDB() {
// //   try {
// //     await mongoose.connect(mongoDBConnectionString, mongoConnectionOptions);
// //     console.log('✅ MongoDB connected successfully');
// //     console.log(`🌐 Connected to cluster: ${mongoose.connection.host}`);
// //     console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
// //   } catch (error) {
// //     console.error('❌ MongoDB Connection Error:', error.message);
// //     process.exit(1);
// //   }
// // }

// // // MongoDB User Schema
// // const userSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true },
// //   name: { type: String, required: true },
// //   password: { type: String, required: true },
// //   createdAt: { type: Date, default: Date.now },
// //   token: {type: String, required: true, unique: true}
// // });

// // const User = mongoose.model('User', userSchema);

// // // Register Endpoint
// // app.post('/auth/register', async (req, res) => {
// //   const { name, email, password } = req.body;

// //   if (!name || !email || !password) {
// //     return res.status(400).json({ message: 'All fields are required' });
// //   }

// //   try {
// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Email is already registered' });
// //     }

// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // Create new user
// //     const newUser = new User({ name, email, password: hashedPassword });
// //     await newUser.save();

// //     res.status(201).json({ message: 'User registered successfully' });
// //   } catch (error) {
// //     console.error('❌ Registration Error:', error.message);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });

// // // Login Endpoint
// // app.post('/auth/login', async (req, res) => {
// //   const { email, password } = req.body;

// //   if (!email || !password) {
// //     return res.status(400).json({ message: 'Email and password are required' });
// //   }

// //   try {
// //     // Find user by email
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     // Check password
// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Generate JWT
// //     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
// //       expiresIn: '1h',
// //     });

// //     res.status(200).json({ token, message: 'Login successful' });
// //   } catch (error) {
// //     console.error('❌ Login Error:', error.message);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });

// // // Middleware to verify JWT
// // const authenticateToken = (req, res, next) => {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ message: 'Unauthorized' });
// //   }

// //   const token = authHeader.split(' ')[1];
// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (error) {
// //     return res.status(401).json({ message: 'Invalid token' });
// //   }
// // };

// // // Get User Profile Endpoint
// // app.get('/profile', authenticateToken, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     res.status(200).json({ name: user.name, email: user.email });
// //   } catch (error) {
// //     console.error('❌ Error fetching user profile:', error.message);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });

// // // Server Startup Function
// // async function startServer() {
// //   try {
// //     await connectToMongoDB();

// //     const PORT = process.env.PORT || 5000;
// //     app.listen(PORT, () => {
// //       console.log(`🚀 Server running on http://localhost:${PORT}`);
// //     });
// //   } catch (error) {
// //     console.error('❌ Server Startup Error:', error.message);
// //     process.exit(1);
// //   }
// // }

// // // Start the server
// // startServer();


// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Resolve current module's directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// // Initialize Express app
// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connection configuration
// const mongoDBConnectionString = process.env.MONGO_URI;
// const mongoConnectionOptions = {
//   autoIndex: true,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// };

// // MongoDB connection with enhanced logging and error handling
// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(mongoDBConnectionString, mongoConnectionOptions);
//     console.log(`✅ MongoDB connected successfully`);
//     console.log(`🌐 Cluster: ${mongoose.connection.host}`);
//     console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
//   } catch (error) {
//     console.error(`❌ MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // MongoDB User schema and model
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   name: { type: String, required: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const User = mongoose.model('User', userSchema);

// // Register endpoint
// app.post('/auth/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(`❌ Registration Error: ${error.message}`);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Login endpoint
// app.post('/auth/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     res.status(200).json({ token, message: 'Login successful' });
//   } catch (error) {
//     console.error(`❌ Login Error: ${error.message}`);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Middleware to verify JWT
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Get user profile endpoint
// app.get('/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ name: user.name, email: user.email });
//   } catch (error) {
//     console.error(`❌ Error fetching user profile: ${error.message}`);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Server startup function
// const startServer = async () => {
//   try {
//     await connectToMongoDB();

//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error(`❌ Server Startup Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

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

// MongoDB connection with enhanced logging and error handling
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

// MongoDB User schema and model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullNames: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

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
    const newUser = new User({ email, fullNames, password: hashedPassword, phone, address });

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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(`❌ Login Error: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

// Server startup function
const startServer = async () => {
  try {
    await connectToMongoDB();

    const PORT = 4050; // Updated Port
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