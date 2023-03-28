// eslint-disable-next-line import/named
import { notifications, users } from '../database/models';

/**
 * notification services
 */
export default class NotificationServices {
  // eslint-disable-next-line require-jsdoc
  static async getAllNotifications(id) {
    const notificationz = await notifications.findAll({
      where: { receiverId: id },
      include: {
        model: users,
        as: 'user',
        attributes: ['username', 'email'],
      },
    });
    return notificationz;
  }

  // eslint-disable-next-line require-jsdoc
  static async deleteNotification(data) {
    const notification = await notifications.findOne({
      where: { receiverId: data.userId },
    });
    if (!notification) {
      return 'not exist';
    }
    if (notification.receiverId !== data.userId) {
      return 'forbidden';
    }
    await notification.destroy({
      where: { id: data.notId, recipientId: data.userId },
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
