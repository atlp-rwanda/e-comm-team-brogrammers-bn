/* eslint-disable import/no-duplicates */
/* eslint-disable no-else-return */
/* eslint-disable object-shorthand */
/* eslint-disable comma-spacing */
import express from 'express';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import passport from 'passport';
import Users from '../controllers/users.controllers';
import checkUserExist, {
  checkUserByEmail,
} from '../middlewares/checkUserExist';
import Status from '../controllers/status.controller';
import loginValidate from '../middlewares/loginValidate';
import profileVatidate from '../middlewares/profileValidate';
import mfaValidate from '../middlewares/mfaValidate';
import signupVatidate from '../middlewares/signupValidate';
import checkRole from '../middlewares/Checkrole';
import isAuthenticated from '../middlewares/verifyToken';
import { resetPassword } from '../validations/fields.validation';
import requestValidator from '../middlewares/requestValidator';
import disableUser from '../validations/disable.validation';
import Admin from '../controllers/admin.controller';
import { Jwt } from '../helpers/jwt';
import { googlePass } from '../controllers/oauth.controller';
import upload from '../configs/multer';
import { getAllLogs } from '../controllers/logs.controller';

googlePass();
const routes = express.Router();

routes.post('/signup', signupVatidate, checkUserExist, Users.signup);
routes.get('/verify-email/:token', Users.verifyEmail);
routes.post(
  '/reset-password',
  requestValidator(resetPassword),
  Users.sendResetPasswordCode
);
routes.get(
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
routes.patch(
  '/role/:email',
  isAuthenticated,
  checkRole(['admin']),
  Users.setRole
);

// images
routes.patch(
  '/profile/avatar',
  isAuthenticated,
  upload.single('image'),
  Users.updateAvatar
);
routes.patch(
  '/profile/cover-image',
  isAuthenticated,
  upload.single('image'),
  Users.updateCoverImage
);

// Disable account
routes.patch(
  '/disable/:userId',
  isAuthenticated,
  checkRole(['admin']),
  requestValidator(disableUser),
  Users.disableUser
);
routes.get('/logout', isAuthenticated, Users.logout);
// Admin Routes
routes.post('/createUser', isAuthenticated, checkRole(['admin']), Admin.signup);
routes.patch('/:id', isAuthenticated, checkRole(['admin']), Admin.updateUser);
routes.delete('/:id', isAuthenticated, checkRole(['admin']), Admin.deleteUser);
routes.get('/all', isAuthenticated, checkRole(['admin']), Admin.getAllUsers);
routes.get('/logs/all', isAuthenticated, checkRole(['admin']), getAllLogs);

// Google routes
routes.get('/redirect', (req, res) => {
  try {
    if (req.query.key) {
      const user = Jwt.verifyToken(req.query.key);
      return res.status(200).json({
        message: 'Thanks for logging in',
        user: user,
        token: req.query.key,
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
routes.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
routes.get(
  '/stats',
  isAuthenticated,
  checkRole(['seller', 'admin']),
  Status.getProductsStatus
);
routes.get(
  '/stats/graph/:range',
  isAuthenticated,
  checkRole(['seller', 'admin']),
  Status.getProductsStatusGraph
);

routes.get(
  '/auth/google/redirect',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/',
  }),
  checkUserByEmail,
  Users.googleAuthHandler
);
export default routes;
