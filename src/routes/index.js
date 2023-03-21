import express from 'express';
import HomeControllers from '../controllers';
import users from './users';
import products from './products';
import wishlist from './wishlist';

const routes = express();

routes.get('/home', HomeControllers.welcome);
routes.use('/users', users);
routes.use('/products', products);
routes.use('/wishlist', wishlist);
export default routes;
