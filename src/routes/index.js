import express from 'express';
import HomeControllers from '../controllers';
import users from './users';

const routes = express();

routes.get('/home', HomeControllers.welcome);
routes.use('/users', users);

export default routes;