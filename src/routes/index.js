import express from 'express';
import HomeControllers from '../controllers';
import users from './users';
import products from './products';

const routes = express();

routes.get('/home', HomeControllers.welcome);
routes.use('/users', users);
routes.use('/products', products);

export default routes;
