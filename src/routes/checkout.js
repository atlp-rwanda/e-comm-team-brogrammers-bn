import express from 'express';
import { createOrder, getCurrentUserOrders } from '../controllers/checkout';
import catchError from '../middlewares/catchError';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import requestValidator from '../middlewares/requestValidator';
import orderValidation from '../validations/checkout.validation';

const router = express.Router();

router.get(
  '/',
  isAuthenticated,
  checkRole(['buyer']),
  catchError(getCurrentUserOrders)
);

router.post(
  '/',
  isAuthenticated,
  requestValidator(orderValidation),
  checkRole(['buyer']),
  catchError(createOrder)
);

export default router;
