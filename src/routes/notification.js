import express from 'express';
import NotificationController from '../controllers/notification.controller';
import isAuthenticated from '../middlewares/verifyToken';

const router = express.Router();
router.get('/', isAuthenticated, NotificationController.getAllNotifications);
router.delete('/:id', isAuthenticated, NotificationController.deleteNotification);
router.patch('/clear', isAuthenticated, NotificationController.clearNotifications);
export default router;
