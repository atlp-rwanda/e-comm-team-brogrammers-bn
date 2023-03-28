import express from 'express';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Users from '../controllers/users.controllers';
import checkUserExist from '../middlewares/checkUserExist';
import loginValidate from '../middlewares/loginValidate';
import profileVatidate from '../middlewares/profileValidate';
import mfaValidate from '../middlewares/mfaValidate';
import signupVatidate from '../middlewares/signupValidate';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import { resetPassword } from '../validations/fields.validation';
import requestValidator from '../middlewares/requestValidator';
import disableUser from '../validations/disable.validation';

const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.get('/verify-email/:token', Users.verifyEmail);
routes.post(
  '/reset-password',
  requestValidator(resetPassword),
  Users.sendResetPasswordCode
);
routes.post(
  '/verify-reset-password/:resetToken',
  Users.verifyResetPasswordCode
);
routes.patch('/change-password', isAuthenticated, Users.changePassword);

routes.patch(
  '/create-admin/:email',
  isAuthenticated,
  checkRole(['admin']),
  Users.CreateAdmin
);
routes.post('/verify-mfa', mfaValidate, Users.verifyMfaCode);
routes.post('/enable-mfa', isAuthenticated, Users.enableMfa);
routes.post('/disable-mfa', isAuthenticated, Users.disableMfa);
routes.post('/login', loginValidate, Users.login);
routes.get('/profile', isAuthenticated, Users.getProfile);
routes.patch('/profile', isAuthenticated, profileVatidate, Users.editProfile);
// eslint-disable-next-line no-undef
routes.patch('/role/:email', isAuthenticated, checkRole(['admin']), Users.setRole);

// Disable account
routes.patch(
  '/disable/:userId',
  isAuthenticated,
  checkRole(['admin']),
  requestValidator(disableUser),
  Users.disableUser
);
routes.get(
  '/logout',
  isAuthenticated,
  Users.logout
);
export default routes;
