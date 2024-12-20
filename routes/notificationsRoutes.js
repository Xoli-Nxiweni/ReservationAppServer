import { Router } from 'express';
import { getAllNotifications, getNotificationById, createNotification, deleteNotification } from './../controllers/notificationsController.js';

const router = Router();

// Route to get all notifications
router.get('/', getAllNotifications);

// Route to get a single notification by ID
router.get('/:id', getNotificationById);

// Route to create a new notification
router.post('/', createNotification);

// Route to delete a notification by ID
router.delete('/:id', deleteNotification);

export default router;