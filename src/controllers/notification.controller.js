/* eslint-disable require-jsdoc */
import NotificationServices from '../services/notification.services';
// eslint-disable-next-line import/named
import { users, notifications } from '../database/models';

export default class NotificationController {
  static async getAllNotifications(req, res) {
    try {
      const totalCount = await notifications.count({ where: { receiverId: req.user.id } });
      // eslint-disable-next-line radix
      const page = parseInt(req.query.page) || 1;
      // eslint-disable-next-line radix
      const limit = parseInt(req.query.limit) || totalCount;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const results = {};
      if (endIndex < totalCount) {
        results.next = {
          page: page + 1,
          limit,
        };
      }
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit,
        };
      }
      results.results = await notifications.findAll({
        where: { receiverId: req.user.id },
        limit,
        attributes: { exclude: ['reciverId'] },
        include: [
          {
            model: users,
            as: 'receiver',
            attributes: ['username', 'email'],
          }
        ],
        offset: startIndex,
      });
      const allNotifications = results;
      res
        .status(200)
        .json({ message: 'All notifications retrieved successfully', allNotifications });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }

  static async markAllAsRead(req, res) {
    return NotificationServices.markAllNotificationAsRead(req.user.id, res);
  }

  static async markAsRead(req, res) {
    return NotificationServices.markNotificationAsReadOrUnread(
      req.params.notificationId,
      res,
      true
    );
  }

  static async markAsUnread(req, res) {
    return NotificationServices.markNotificationAsReadOrUnread(
      req.params.notificationId,
      res,
      false
    );
  }

  static async deleteNotification(req, res) {
    try {
      const response = await NotificationServices.deleteNotification({
        notId: req.params.id,
        userId: req.user.id,
      });
      if (response === 'not exist') {
        return res
          .status(404)
          .json({ status: 404, error: "Notification doesn't exist" });
      }
      if (response === 'forbidden') {
        return res.status(403).json({
          status: 403,
          error: 'You are not the recipient of the notification',
        });
      }
      return res
        .status(202)
        .json({ status: 202, message: 'Notification deleted' });
    } catch (error) {
      return res.status(500).json({ status: 500, error: 'Server error' });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {res} response
   */
  static async clearNotifications(req, res) {
    try {
      const response = await NotificationServices.clearNotifications({
        userId: req.user.id,
      });
      if (response === 'not exist') {
        return res
          .status(404)
          .json({ status: 404, error: 'no notification to clear' });
      }
      return res
        .status(202)
        .json({ status: 202, message: 'Notification cleared' });
    } catch (error) {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
}
