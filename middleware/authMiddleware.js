// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const authMiddleware = async (req, res, next) => {
//   try {
//     // Check if authorization header exists
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     // Extract token (remove 'Bearer ' prefix)
//     const token = authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Invalid token format' });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user and attach to request
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: 'User not found' });
//     }

//     // Attach user to request object
//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
//     console.error('Auth middleware error:', error);
//     res.status(500).json({ message: 'Authentication error', details: error.message });
//   }
// };

// export default authMiddleware;




import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error', details: error.message });
  }
};

export default authMiddleware;