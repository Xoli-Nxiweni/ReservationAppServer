import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   fullNames: { type: String, required: true },
//   password: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin', 'restaurant'], default: 'user' },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('User', userSchema);

// const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullNames: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, default: 'user' },
  profilePicture: { type: String, default: null }, // Ensure this field exists
});

export default mongoose.model('User', userSchema);

// module.exports = User;