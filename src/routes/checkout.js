import express from 'express';
import {
  createOrder, getCurrentUserOrders, updateOrder, deleteOrder
} from '../controllers/checkout';
import catchError from '../middlewares/catchError';
import isAuthenticated from '../middlewares/verifyToken';
import requestValidator from '../middlewares/requestValidator';
import orderValidation from '../validations/checkout.validation';

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

router.patch('/:order_id', isAuthenticated, requestValidator(orderValidation), catchError(updateOrder));
router.delete('/:order_id', isAuthenticated, catchError(deleteOrder));

export default router;
