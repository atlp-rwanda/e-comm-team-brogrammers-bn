import express from 'express';
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import loginValidate from '../middlewares/loginValidate';
import profileVatidate from '../middlewares/profileValidate';
import mfaValidate from '../middlewares/mfaValidate';
import signupVatidate from '../middlewares/signupValidate';
import isAuthenticated from '../middlewares/verifyToken';

const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.get('/verify-email/:token', Users.verifyEmail);
routes.post('/verify-mfa', mfaValidate, Users.verifyMfaCode);
routes.post('/enable-mfa', isAuthenticated, Users.enableMfa);
routes.post('/disable-mfa', isAuthenticated, Users.disableMfa);
routes.post('/login', loginValidate, Users.login);

routes.get('/profile', isAuthenticated, Users.getProfile);
routes.patch('/profile', isAuthenticated, profileVatidate, Users.editProfile);

export default routes;
