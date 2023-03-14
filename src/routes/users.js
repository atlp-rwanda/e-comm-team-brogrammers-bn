import express from 'express';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import loginValidate from '../middlewares/loginValidate';
import profileVatidate from '../middlewares/profileValidate';
import signupVatidate from '../middlewares/signupValidate';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';

const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.get('/verify-email/:token', Users.verifyEmail);
routes.patch('/create-admin/:email', isAuthenticated, checkRole(['admin']), Users.CreateAdmin);
routes.post('/login', loginValidate, Users.login);
routes.get('/profile', isAuthenticated, Users.getProfile);
routes.patch('/profile', isAuthenticated, profileVatidate, Users.editProfile);

export default routes;
