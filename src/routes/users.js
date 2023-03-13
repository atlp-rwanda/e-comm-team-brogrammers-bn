import express from 'express';
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import loginValidate from '../middlewares/loginValidate';
import signupVatidate from '../middlewares/signupValidate';

const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.get('/verify-email/:token', Users.verifyEmail);

routes.post('/login', loginValidate, Users.login);
export default routes;
