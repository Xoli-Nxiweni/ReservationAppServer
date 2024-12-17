// // import bcrypt from 'bcrypt';
// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // // Register a new user
// // export const registerUser = async (req, res) => {
// //   const { email, fullNames, password, phone, address, role } = req.body;

// //   if (!email || !fullNames || !password || !phone || !address) {
// //     return res.status(400).json({ message: 'All fields are required' });
// //   }

// //   try {
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'Email is already registered' });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const newUser = new User({ 
// //       email, 
// //       fullNames, 
// //       password: hashedPassword, 
// //       phone, 
// //       address,
// //       role: role || 'user'
// //     });

// //     await newUser.save();
// //     res.status(201).json({ message: 'User registered successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };

// // // Login a user
// // export const loginUser = async (req, res) => {
// //   const { email, password } = req.body;

// //   if (!email || !password) {
// //     return res.status(400).json({ message: 'Email and password are required' });
// //   }

// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     const token = jwt.sign({ 
// //       id: user._id, 
// //       email: user.email,
// //       role: user.role 
// //     }, process.env.JWT_SECRET, {
// //       expiresIn: '5h',
// //     });

// //     res.status(200).json({ token, role: user.role, message: 'Login successful' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };

// // // Get user profile
// // export const getProfile = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }

// //     res.status(200).json({ 
// //       email: user.email, 
// //       fullNames: user.fullNames, 
// //       phone: user.phone, 
// //       address: user.address 
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };

// // export const UpdateUserProfile = () =>{

// //   //update  email, 
// //       // fullNames, 
// //       // password: hashedPassword, 
// //       // phone, 
// //       // address,

// // }

// // export const SetProfilePicture = () =>{
  
// // }

// // export const UpdateProfilePicture = () =>{
  
// // }

// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import mongoose from 'mongoose';
// import multer from 'multer';

// // Utility function to validate email format
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// // Register a new user
// export const registerUser = async (req, res) => {
//   const { email, fullNames, password, phone, address, role } = req.body;

//   // Comprehensive validation
//   if (!email || !fullNames || !password || !phone || !address) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   // Validate email format
//   if (!validateEmail(email)) {
//     return res.status(400).json({ message: 'Invalid email format' });
//   }

//   // Password strength check
//   if (password.length < 8) {
//     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ 
//       email, 
//       fullNames, 
//       password: hashedPassword, 
//       phone, 
//       address,
//       role: role || 'user',
//       profilePicture: null // Default to null
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// // Login a user
// export const loginUser = async (req, res) => {
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

//     const token = jwt.sign({ 
//       id: user._id, 
//       email: user.email,
//       role: user.role 
//     }, process.env.JWT_SECRET, {
//       expiresIn: '5h',
//     });

//     res.status(200).json({ 
//       token, 
//       role: user.role, 
//       profilePicture: user.profilePicture,
//       message: 'Login successful' 
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// // Get user profile
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ 
//       email: user.email, 
//       fullNames: user.fullNames, 
//       phone: user.phone, 
//       address: user.address,
//       profilePicture: user.profilePicture,
//       role: user.role
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// const createUploadDirectory = () => {
//   const uploadPath = path.join(process.cwd(), 'uploads', 'profile-pictures');
  
//   try {
//     // Create directory if it doesn't exist
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//       console.log(`Created upload directory: ${uploadPath}`);
//     }
//     return uploadPath;
//   } catch (error) {
//     console.error('Error creating upload directory:', error);
//     throw error;
//   }
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = createUploadDirectory();
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `profilePicture-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type'), false);
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB
//   }
// });

// // Update user profile
// export const updateUserProfile = async (req, res) => {
//   const { email, fullNames, phone, address, password } = req.body;

//   // Validate that at least one field is being updated
//   if (!email && !fullNames && !phone && !address && !password) {
//     return res.status(400).json({ message: 'No update fields provided' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Email validation and uniqueness check
//     if (email) {
//       if (!validateEmail(email)) {
//         return res.status(400).json({ message: 'Invalid email format' });
//       }

//       const existingUser = await User.findOne({ email });
//       if (existingUser && existingUser._id.toString() !== req.user.id) {
//         return res.status(400).json({ message: 'Email is already in use' });
//       }
//       user.email = email;
//     }

//     // Update other fields if provided
//     if (fullNames) user.fullNames = fullNames;
//     if (phone) user.phone = phone;
//     if (address) user.address = address;

//     // Password update with validation
//     if (password) {
//       if (password.length < 8) {
//         return res.status(400).json({ message: 'Password must be at least 8 characters long' });
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       user.password = hashedPassword;
//     }

//     await user.save();

//     res.status(200).json({ 
//       message: 'Profile updated successfully',
//       user: {
//         email: user.email,
//         fullNames: user.fullNames,
//         phone: user.phone,
//         address: user.address,
//         profilePicture: user.profilePicture
//       }
//     });
//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// // Set initial profile picture
// export const setProfilePicture = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No profile picture uploaded' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Assuming file is uploaded and you want to store the path
//     user.profilePicture = req.file.path; // or req.file.location for cloud storage

//     await user.save();

//     res.status(200).json({ 
//       message: 'Profile picture set successfully',
//       profilePicture: user.profilePicture 
//     });
//   } catch (error) {
//     console.error('Profile picture set error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// // Update existing profile picture
// export const updateProfilePicture = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No new profile picture uploaded' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Optional: Add logic to delete previous profile picture if using local storage
//     const oldProfilePicture = user.profilePicture;

//     // Update to new profile picture
//     user.profilePicture = req.file.path; // or req.file.location

//     await user.save();

//     res.status(200).json({ 
//       message: 'Profile picture updated successfully',
//       profilePicture: user.profilePicture,
//       oldProfilePicture // You might want to handle deletion separately
//     });
//   } catch (error) {
//     console.error('Profile picture update error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

// // Get profile picture
// export const getProfilePicture = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (!user.profilePicture || !fs.existsSync(user.profilePicture)) {
//       return res.status(404).json({ message: 'Profile picture not found' });
//     }

//     // Send the file
//     res.sendFile(path.resolve(user.profilePicture));
//   } catch (error) {
//     console.error('Get profile picture error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error', 
//       details: error.message 
//     });
//   }
// };

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

// Utility function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register a new user
// export const registerUser = async (req, res) => {
//   const { email, fullNames, password, phone, address, role } = req.body;

//   // Comprehensive validation
//   if (!email || !fullNames || !password || !phone || !address) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   // Validate email format
//   if (!validateEmail(email)) {
//     return res.status(400).json({ message: 'Invalid email format' });
//   }

//   // Password strength check
//   if (password.length < 8) {
//     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already registered' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       fullNames,
//       password: hashedPassword,
//       phone,
//       address,
//       role: role || 'user',
//       profilePicture: null, // Default to null
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

export const registerUser = async (req, res) => {
  const { email, fullNames, password, phone, address, role } = req.body;

  // Comprehensive validation
  if (!email || !fullNames || !password || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Password strength check
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
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
      address,
      role: role || 'user',
      profilePicture: null, // Default to null
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Login a user
// export const loginUser = async (req, res) => {
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

//     const token = jwt.sign(
//       {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '5h' }
//     );

//     // res.status(200).json({
//     //   token,
//     //   role: user.role,
//     //   profilePicture: user.profilePicture,
//     //   message: 'Login successful',
//     // });

//     res.status(200).json({
//       user: {
//         role: user.role,
//         email: user.email,
//         profilePicture: user.profilePicture,
//       },
//       token,
//       message: 'Login successful',
//     });
    
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

export const loginUser = async (req, res) => {
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullNames: user.fullNames,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture, // Include profilePicture in the response
      },
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Get user profile
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       email: user.email,
//       fullNames: user.fullNames,
//       phone: user.phone,
//       address: user.address,
//       profilePicture: user.profilePicture,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      email: user.email,
      fullNames: user.fullNames,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture, // Include profilePicture in the response
      role: user.role,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { email, fullNames, phone, address, password } = req.body;

  // Validate that at least one field is being updated
  if (!email && !fullNames && !phone && !address && !password) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Email validation and uniqueness check
    if (email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }

    // Update other fields if provided
    if (fullNames) user.fullNames = fullNames;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Password update with validation
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        email: user.email,
        fullNames: user.fullNames,
        phone: user.phone,
        address: user.address,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Set or update profile picture
// export const updateProfilePicture = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No profile picture uploaded' });
//   }

//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Delete old profile picture if it exists
//     if (user.profilePicture && fs.existsSync(user.profilePicture)) {
//       fs.unlinkSync(user.profilePicture);
//     }

//     // Update to new profile picture
//     user.profilePicture = req.file.path;

//     await user.save();

//     res.status(200).json({
//       message: 'Profile picture updated successfully',
//       profilePicture: user.profilePicture,
//     });
//   } catch (error) {
//     console.error('Profile picture update error:', error);
//     res.status(500).json({ message: 'Internal server error', details: error.message });
//   }
// };

export const updateProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No profile picture uploaded' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if it exists
    if (user.profilePicture && fs.existsSync(user.profilePicture)) {
      fs.unlinkSync(user.profilePicture);
    }

    // Update to new profile picture
    user.profilePicture = req.file.path;

    await user.save();

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};

// Get profile picture
export const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profilePicture || !fs.existsSync(user.profilePicture)) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    // Send the file
    res.sendFile(path.resolve(user.profilePicture));
  } catch (error) {
    console.error('Get profile picture error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
};