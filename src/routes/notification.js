import express from 'express';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import NotificationController from '../controllers/notification.controller';
import isAuthenticated from '../middlewares/verifyToken';
import catchError from '../middlewares/catchError';

const router = express.Router();
router.get('/', isAuthenticated, NotificationController.getAllNotifications);
router.delete('/:id', isAuthenticated, NotificationController.deleteNotification);
router.patch('/clear', isAuthenticated, NotificationController.clearNotifications);
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
