import express from 'express';
import {
  createOrder, getCurrentUserOrders, updateOrder, deleteOrder, viewOrder, getAllOrders,
} from '../controllers/checkout';
import catchError from '../middlewares/catchError';
import isAuthenticated from '../middlewares/verifyToken';
import checkRole from '../middlewares/Checkrole';
import checkoutVatidate from '../middlewares/checkoutValidate';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  catchError(getCurrentUserOrders)
);

router.post(
  '/',
  isAuthenticated,
  checkoutVatidate,
  catchError(createOrder)
);

router.get('/orders', isAuthenticated, checkRole(['admin']), catchError(getAllOrders));

router.get('/:order_id', isAuthenticated, viewOrder);
router.patch('/:order_id', isAuthenticated, checkoutVatidate, catchError(updateOrder));
router.delete('/:order_id', isAuthenticated, catchError(deleteOrder));

export default router;
