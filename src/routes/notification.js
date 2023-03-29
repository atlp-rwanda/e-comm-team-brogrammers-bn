import express from 'express';
import NotificationController from '../controllers/notification.controller';
import catchError from '../middlewares/catchError';
import isAuthenticated from '../middlewares/verifyToken';
const router = express.Router();
router.get('/', isAuthenticated, NotificationController.getAllNotifications);
router.post(
  '/read/all',
  isAuthenticated,
  catchError(NotificationController.markAllAsRead)
);
router.post(
  '/read/:notificationId',
  isAuthenticated,
  catchError(NotificationController.markAsRead)
);
router.post(
  '/unread/:notificationId',
  isAuthenticated,
  catchError(NotificationController.markAsUnread)
);

export default router;
