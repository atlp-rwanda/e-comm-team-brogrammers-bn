import express from 'express';
import { SubscriberController } from '../controllers/subscriber.controller';
// eslint-disable-next-line import/no-unresolved, import/extensions
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import subscribeValidate from '../middlewares/subscribeValidate';
import { checkSubscriberExist } from '../middlewares/checkUserExist';

const subroutes = express.Router();

subroutes.post('/', subscribeValidate, checkSubscriberExist, SubscriberController.subscribe);
subroutes.get('/unsubscribe/:id', SubscriberController.unsubscribe);
subroutes.get('/verify/:token', SubscriberController.verify);
subroutes.get('/all', isAuthenticated, checkRole(['admin']), SubscriberController.getAllSubscribers);
subroutes.delete('/:id', isAuthenticated, checkRole(['admin']), SubscriberController.deleteSubscriber);

export default subroutes;
