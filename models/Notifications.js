import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String, // e.g., "reservation", "reminder", "alert"
    required: true,
  },
  link: {
    type: String, // URL or route to redirect the user
    default: null,
  },
  expiry: {
    type: Date, // Expiry date for the notification
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;