import express from 'express';
import HomeControllers from '../controllers';
import users from './users';
import products from './products';
import wishlist from './wishlist';
import cart from './cart';
import reviews from './reviews.routes';
import checkoutRoutes from './checkout';
import chat from './chat';
import notification from './notification';

const routes = express();

routes.get('/home', HomeControllers.welcome);
routes.use('/users', users);
routes.use('/products', products);
routes.use('/wishlist', wishlist);
routes.use('/reviews', reviews);
routes.use('/cart', cart);
routes.use('/checkout', checkoutRoutes);
routes.use('/chat', chat);
routes.use('/notification', notification);
export default routes;
