import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const registerUser = async (req, res) => {
  const { email, fullNames, password, phone, address, role } = req.body;

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
      address,
      role: role || 'user'
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login a user
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

    const token = jwt.sign({ 
      id: user._id, 
      email: user.email,
      role: user.role 
    }, process.env.JWT_SECRET, {
      expiresIn: '5h',
    });

    res.status(200).json({ token, role: user.role, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user profile
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
      address: user.address 
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};