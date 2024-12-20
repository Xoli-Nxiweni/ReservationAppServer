// import express from 'express';
// import { 
//   registerUser, 
//   loginUser, 
//   getProfile,
//   getProfilePicture, 
//   updateUserProfile, 
//   setProfilePicture, 
//   updateProfilePicture 
// } from '../controllers/authController.js';
// import path from 'path';
// import { authenticateToken } from '../utils/errorHandler.js';
// import multer from 'multer';
// import authMiddleware from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join());
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { 
//     fileSize: 5 * 1024 * 1024 // 5MB file size limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
//     }
//   }
// });

// // Register endpoint
// router.post('/register', registerUser);

// // Login endpoint
// router.post('/login', loginUser);

// // Get user profile endpoint
// router.get('/profile', authenticateToken, getProfile);

// // Update user profile endpoint
// router.put('/profile', authenticateToken, updateUserProfile);

// // Set profile picture endpoint
// router.post('/profile/picture', 
//   authenticateToken, 
//   upload.single('profilePicture'), 
//   setProfilePicture
// );

// // Update profile picture endpoint
// router.put('/profile/picture', 
//   authenticateToken, 
//   upload.single('profilePicture'), 
//   updateProfilePicture
// );

// // Get profile picture endpoint
// router.get('/profile/picture', 
//   authenticateToken, 
//   updateProfilePicture
// );

// // Error handling middleware for file upload
// // router.use((err, req, res, next) => {
// //   if (err instanceof multer.MulterError) {
// //     // A Multer error occurred when uploading.
// //     return res.status(400).json({ 
// //       message: 'File upload error', 
// //       details: err.message 
// //     });
// //   } else if (err) {
// //     // An unknown error occurred when uploading.
// //     return res.status(500).json({ 
// //       message: 'Unknown upload error', 
// //       details: err.message 
// //     });
// //   }
// //   next();
// // });

// router.use((err, req, res, next) => {

//     if (err instanceof multer.MulterError) {
    
//     return res.status(400).json({ message: 'File upload error', details: err.message });
    
//     } else if (err) {
    
//     return res.status(500).json({ message: 'Unknown upload error', details: err.message });
    
//     }
    
//     next();
    
//     });

// // router.post('/profile-picture', 
// //     authMiddleware, 
// //     setProfilePicture, 
// //   );
  
// //   router.put('/profile-picture', 
// //     authMiddleware, 
// //     setProfilePicture, 
// //     updateProfilePicture
// //   );
  
//   router.get('/profile-picture', 
//     authMiddleware, 
//     getProfilePicture
//   );

// export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  updateProfilePicture,
  getProfilePicture,
  getAllProfiles,
  getAllTotalProfiles
} from '../controllers/authController.js';
import cors from 'cors';
// import express from 'express';
const app = express();
app.use(cors());


const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/profile-pictures');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profilePicture-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Register endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

// Get user profile endpoint
router.get('/profile', authMiddleware, getProfile);

router.get('/all-profiles', authMiddleware, getAllProfiles);

router.get('/total-profiles', authMiddleware, getAllTotalProfiles);

// Update user profile endpoint
router.put('/profile', authMiddleware, updateUserProfile);

// Set or update profile picture endpoint
router.put('/profile/picture', authMiddleware, upload.single('profilePicture'), updateProfilePicture);

// Get profile picture endpoint
router.get('/profile/picture', authMiddleware, getProfilePicture);

export default router;