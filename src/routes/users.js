import express from 'express';
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import loginValidate from '../middlewares/loginValidate';
import signupVatidate from '../middlewares/signupValidate';

const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
<<<<<<< HEAD
routes.patch('/update-password', Users.updatePassword);
=======
routes.get('/verify-email/:token', Users.verifyEmail);
>>>>>>> develop

routes.post('/login', loginValidate, Users.login);
export default routes;
