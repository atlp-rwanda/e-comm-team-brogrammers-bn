import express from 'express';
import {
  createOrder, getCurrentUserOrders, updateOrder, deleteOrder, getAllOrders
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

router.patch('/:order_id', isAuthenticated, requestValidator(orderValidation), catchError(updateOrder));
router.delete('/:order_id', isAuthenticated, catchError(deleteOrder));

router.get('/buyer-orders',isAuthenticated,checkRole(['admin']), catchError(getAllOrders));

export default router;
