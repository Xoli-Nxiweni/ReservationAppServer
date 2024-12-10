import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  cuisine: { type: String, required: true },
  availableSlots: [{
    date: { type: Date, required: true },
    times: [{ type: String, required: true }]
  }],
  capacity: { type: Number, required: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);