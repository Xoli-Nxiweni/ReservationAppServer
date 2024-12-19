// // // middleware/authenticateUser.js
// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js';

// // const authenticateUser = async (req, res, next) => {
// //   try {
// //     // Log the entire Authorization header for debugging
// //     console.log('Full Authorization Header:', req.headers.authorization);

// //     // Extract token from Authorization header
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader) {
// //       console.log('No Authorization header');
// //       return res.status(401).json({ error: 'No token provided' });
// //     }

// //     // Split the header and get the token (expecting "Bearer <token>")
// //     const parts = authHeader.split(' ');
    
// //     if (parts.length !== 2) {
// //       console.log('Invalid Authorization header format');
// //       return res.status(401).json({ error: 'Invalid token format' });
// //     }

// //     const [scheme, token] = parts;

// //     if (!/^Bearer$/i.test(scheme)) {
// //       console.log('Invalid authorization scheme');
// //       return res.status(401).json({ error: 'Token must be Bearer' });
// //     }

// //     // Verify the token
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     // Find user
// //     const user = await User.findById(decoded.userId);

// //     if (!user) {
// //       console.log('User not found');
// //       return res.status(401).json({ error: 'Invalid token' });
// //     }

// //     // Attach user to request
// //     req.user = {
// //       id: user._id.toString(),
// //       email: user.email,
// //       role: user.role
// //     };

// //     next();
// //   } catch (error) {
// //     console.error('Authentication Error:', error);

// //     if (error.name === 'JsonWebTokenError') {
// //       return res.status(401).json({ error: 'Invalid token' });
// //     }
    
// //     if (error.name === 'TokenExpiredError') {
// //       return res.status(401).json({ error: 'Token expired' });
// //     }

// //     res.status(500).json({ error: 'Authentication failed' });
// //   }
// // };

// // export default authenticateUser;

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const authenticateUser = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ error: 'No token provided' });
//     }

//     const parts = authHeader.split(' ');

//     if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
//       return res.status(401).json({ error: 'Invalid token format' });
//     }

//     const token = parts[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log('Decoded JWT Payload:', decoded); // Log the decoded payload

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       console.error('User not found for ID:', decoded.id);
//       return res.status(401).json({ error: 'Invalid token: User not found' });
//     }

//     console.log('User Found:', user); // Log the user object

//     req.user = {
//       id: user._id.toString(),
//       email: user.email,
//       role: user.role,
//     };

//     next();
//   } catch (error) {
//     console.error('Authentication Error:', error);

//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: 'Token expired' });
//     }

//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// export default authenticateUser;

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(500).json({ error: 'Authentication failed' });
  }
};

export default authenticateUser; // Default export