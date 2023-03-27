/* eslint-disable require-jsdoc */
// eslint-disable-next-line import/named
import { notifications } from '../database/models';

export default class NotificationServices {
  static async getAllNotifications(id) {
    const notificationz = await notifications.findAll({
      where: { receiverId: id },
    });
    return notificationz;
  }

  static async markAllNotificationAsRead(userId, res) {
    await notifications.update(
      {
        isRead: true,
      },
      { where: { receiverId: userId } }
    );
    return res.status(200).json({ message: 'All notifications are read' });
  }

  static async markNotificationAsReadOrUnread(
    notificationId,
    res,
    isRead = true
  ) {
    const notification = await notifications.findOne({
      where: { id: notificationId },
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = isRead;
    await notification.save();
    return res.json(notification);
  }

  static async deleteNotification(data) {
    const notification = await notifications.findOne({
      where: { id: data.notId },
    });
    if (!notification) {
      return 'not exist';
    }
    if (notification.receiverId !== data.userId) {
      return 'forbidden';
    }
    await notification.destroy({
      where: { id: data.notId, receiverId: data.userId },
    });
  }

  // eslint-disable-next-line require-jsdoc
  static async clearNotifications(data) {
    const notification = await notifications.findAll({
      where: { id: data.userId },
    });
    if (!notification) {
      return 'no notifications to clear';
    }
    await notifications.destroy({
      where: { receiverId: data.userId },
    });
  }
}
