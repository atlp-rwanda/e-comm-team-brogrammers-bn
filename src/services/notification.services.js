// eslint-disable-next-line import/named, no-unused-vars
import { notifications, users } from '../database/models';

/**
 * notification  services
 */
export class NotificationService {
// eslint-disable-next-line valid-jsdoc, require-jsdoc
  static async saveNotification(notification) {
    return notifications.create(notification);
  }

  // eslint-disable-next-line require-jsdoc
  static async updateNotifications(field, query) {
    return notifications.update(field, { where: query });
  }
  // eslint-disable-next-line require-jsdoc

  // eslint-disable-next-line require-jsdoc
  static async getNotifications(query, limit, page) {
    const offset = (page - 1) * limit;
    const { count, rows } = await notifications.findAndCountAll({
      limit,
      offset,
      where: query,
      order: [['createdAt', 'DESC']],
      include: {
        model: users,
        as: 'receiver',
        attributes: {
          exclude: [
            'password',
            'authCode',
            'mustUpdatePassword',
            'lastTimePasswordUpdated',
          ],
        },
      },
    });
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    const totalItems = count;
    return {
      totalPages, currentPage, totalItems, rows
    };
  }
}

export const knownNotificationType = {
  changePassword: 'change-password',
  productExpired: 'product-expired',
  productWished: 'product-wished',
  productDeleted: 'product-deleted',
  productAvailable: 'product-available',
  newOrder: 'new-order',
  changeOrderStatus: 'change-order-status',
  productRating: 'product-rating',
};
