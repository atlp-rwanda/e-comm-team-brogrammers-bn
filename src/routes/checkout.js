import express from 'express';
import {
  createOrder, getCurrentUserOrders, updateOrder, deleteOrder, viewOrder, getAllOrders,
} from '../controllers/checkout';
import catchError from '../middlewares/catchError';
import isAuthenticated from '../middlewares/verifyToken';
import requestValidator from '../middlewares/requestValidator';
import orderValidation from '../validations/checkout.validation';
import checkRole from '../middlewares/Checkrole';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  catchError(getCurrentUserOrders)
);

router.post(
  '/',
  isAuthenticated,
  requestValidator(orderValidation),
  catchError(createOrder)
);

router.get('/orders', isAuthenticated, checkRole(['admin']), catchError(getAllOrders));

router.get('/:order_id', isAuthenticated, viewOrder, checkRole(['buyer', 'admin']));
router.patch('/:order_id', isAuthenticated, requestValidator(orderValidation), catchError(updateOrder), checkRole(['buyer', 'admin']));
router.delete('/:order_id', isAuthenticated, catchError(deleteOrder), checkRole(['buyer', 'admin']));

export default router;
