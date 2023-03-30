// eslint-disable-next-line import/no-named-as-default
import NotificationService from '../services/notification.services';

export const checkIfHasUnread = async (req, res, next) => {
  const unRead = await NotificationService.getNotifications(
    {
      receiverId: req.user.id,
      isRead: false,
    },
    null,
    null
  );
  if (unRead.rows.length === 0) {
    return res
      .status(404)
      .json({ message: 'You do not have unread notifications' });
  }
  next();
};

export const checkIfHasNotificationId = async (req, res, next) => {
  const notification = await NotificationService.getNotifications(
    {
      id: req.params.notificationId,
    },
    null,
    null
  );
  if (notification.rows.length === 0) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  next();
};

export const receivedPaginationFormat = async (req, res, next) => {
  req.query = {
    limit: req.query.limit || '10',
    page: req.query.page || '1',
  };
  next();
};
