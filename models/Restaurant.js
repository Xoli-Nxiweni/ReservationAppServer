// import mongoose from 'mongoose';

// const restaurantSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   image: { type: String, required: true },
//   location: { type: String, required: true },
//   cuisine: { type: String, required: true },
//   availableSlots: [{
//     date: { type: Date, required: true },
//     times: [{ type: String, required: true }]
//   }],
//   price: {},
//   capacity: { type: Number, required: true },
//   averageRating: { type: Number, default: 0 },
//   totalReviews: { type: Number, default: 0 }
// }, { timestamps: true });

// export default mongoose.model('Restaurant', restaurantSchema);

import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100, // Limit the length of the name
  },
  image: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500, // Limit the description length
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    // Geolocation support
    type: {
      type: String,
      enum: ['Point'], // Only allow 'Point' type
      required: false,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  cuisine: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    match: /^\+?[0-9]{10,15}$/, // Validate phone number format
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validate email format
  },
  availableSlots: [
    {
      date: {
        type: Date,
        required: true,
      },
      times: [
        {
          type: String,
          required: true,
        },
      ],
      capacity: {
        type: Number,
        required: true,
        min: 1, // Minimum capacity should be 1
      },
    },
  ],
  price: {
    // Structured pricing tiers
    type: {
      lunch: {
        type: Number,
        required: true,
      },
      dinner: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1, // Minimum capacity should be 1
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for geolocation queries
restaurantSchema.index({ coordinates: '2dsphere' });

export default mongoose.model('Restaurant', restaurantSchema);