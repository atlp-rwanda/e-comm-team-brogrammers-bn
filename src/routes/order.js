import express from 'express';
import isAuthenticated from '../middlewares/verifyToken';
import checkRole from '../middlewares/Checkrole';

// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import {
  getOrderStatus,
  updateOrderStatus,
  getOrderStatuses,
  getOrderStatusEvents,
  // eslint-disable-next-line import/no-unresolved
} from '../controllers/order.controller';
// eslint-disable-next-line import/named
import { order } from '../database/models';

const router = express.Router();

const ckeckOrderExist = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const orderData = await order.findByPk(orderId, {});
    if (!orderData) {
      return res.status(401).json({ message: 'This order does not exist' });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: 'UNknown error',
      error: error.message,
    });
  }
};

// eslint-disable-next-line no-use-before-define
router.get('/status', isAuthenticated, getOrderStatus);
router.get('/', getOrderStatuses);
router.get('/sse', getOrderStatusEvents);
// eslint-disable-next-line no-use-before-define
router.patch(
  '/:orderId',
  isAuthenticated,
  checkRole(['admin']),
  ckeckOrderExist,
  updateOrderStatus
);

export default router;
