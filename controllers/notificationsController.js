import Notification from '../models/Notifications.js'; // Import the Notification model

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
};
// Function to fetch all notifications for a user, sorted by most recent first
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    }).select('user message read type link expiry createdAt'); // Explicitly select all fields
    res.json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};

// Function to fetch unread notifications for a user, sorted by most recent first
const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id, // Filter notifications by the logged-in user's ID
      read: false // Filter only unread notifications
    }).sort('-createdAt'); // Sort by creation date in descending order
    res.json(notifications); // Return the unread notifications as a JSON response
  } catch (error) {
    handleError(res, error); // Handle any errors that occur
  }
};

// Function to mark a specific notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, // Find the notification by its ID
      { read: true }, // Update the `read` field to true
      { new: true } // Return the updated notification
    );
    res.json(notification); // Return the updated notification as a JSON response
  } catch (error) {
    handleError(res, error); // Handle any errors that occur
  }
};

// Function to mark all unread notifications for a user as read
const markAllAsRead = async (req, res) => {
  try {
    const notifications = await Notification.updateMany(
      {
        user: req.user.id, // Filter notifications by the logged-in user's ID
        read: false // Filter only unread notifications
      },
      { read: true } // Update the `read` field to true
    );
    res.json(notifications); // Return the result of the update operation as a JSON response
  } catch (error) {
    handleError(res, error); // Handle any errors that occur
  }
};

// Function to delete a specific notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id); // Find and delete the notification by its ID
    res.json(notification); // Return the deleted notification as a JSON response
  } catch (error) {
    handleError(res, error); // Handle any errors that occur
  }
};

const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    handleError(res, error);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};

const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    res.json(notification);
  } catch (error) {
    handleError(res, error);
  }
};


// Export all the functions for use in other files
export {
  getNotifications,
  getUnreadNotifications,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationById,
};