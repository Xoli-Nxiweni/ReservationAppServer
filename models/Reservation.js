import mongoose from 'mongoose';

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

export default mongoose.model('Reservation', reservationSchema);