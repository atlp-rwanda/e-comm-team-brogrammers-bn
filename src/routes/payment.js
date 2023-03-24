import express from 'express';
import PaymentControllers from '../controllers/payment.controllers';
import isAuthenticated from '../middlewares/verifyToken';

const routes = express.Router();

routes.get('/success', PaymentControllers.success);
routes.get('/fail', PaymentControllers.fail);
routes.post('/order/:id', isAuthenticated, PaymentControllers.pay);

export default routes;
