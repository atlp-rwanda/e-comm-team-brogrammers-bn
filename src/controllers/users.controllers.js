/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import User from '../services/user.services';
// eslint-disable-next-line import/no-duplicates
import db from '../database/models';
// eslint-disable-next-line import/order, import/no-extraneous-dependencies
import moment from 'moment';
import eventEmitter from '../helpers/eventEmitter';

// eslint-disable-next-line import/named, import/no-duplicates
import { users, notifications } from '../database/models';
/* eslint-disable require-jsdoc */
import { Jwt } from '../helpers/jwt';
import { emailConfig } from '../helpers/emailConfig';
import {
  verifyEmailTemplate,
  mfaEmailTemplate,
  passwordResetEmailTemplate,
  disableEmailTemplate,
  notificationTemplate2,
} from '../helpers/mailTemplate';
import { sendEmail } from '../helpers/mail';

import {
  logSignup,
  redirectGoogle,
  updateAvatarLog,
  logError,
  logSetRole,
  logEmailSent,
  updateImageLog,
  logLogout,
  logVerifyEmail,
  logLogin,
  viewProfile,
  editProfiles,
  enableMfaLog,
  disableMfaLog,
  verifiedMfaLog,
  createAdminLog,
  resetPasswordLog,
  verifyPasswordLog,
  changePasswordLog,
  disableAccountLog,
} from '../loggers/signup.logger';

// eslint-disable-next-line operator-linebreak
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const saltRounds = Number(process.env.SALTROUNDS) || 10;

dotenv.config();
/**
 * user model class
 */
export default class Users {
  /**
   * registering new user.
   * getting user information
   * @param {Object} req valiable
   * @param {Object} res valiable
   * @return {Object} res
   */
  static async signup(req, res) {
    try {
      const { data } = await User.register(req.body);
      const signupToken = jwt.sign(
        { email: data.email },
        process.env.JWT_SECRET
      );
      const userToken = Jwt.generateToken({ data }, '1h');
      if (userToken) {
        data.email_token = userToken;
      }
      await data.save();
      const verificationEmail = verifyEmailTemplate(userToken);
      sendEmail(
        emailConfig({
          email: data.email,
          subject: 'Brogrammers email verification',
          content: verificationEmail,
        })
      );
      logSignup(req);
      logEmailSent(data.email);
      return res.status(201).json({
        message: 'Check your email to verify your account',
        user: data,
        signupToken,
      });
    } catch (e) {
      logError(req, e);
      return res.status(500).json({
        error: e.message,
        message: 'Failed to register a new user',
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const emailToken = req.params.token;
      Users.verifyUser(emailToken, res);
    } catch (error) {
      logError(req, error);
      res.status(500).json({ 'Error:': error });
    }
  }

  static async verifyUser(emailToken, res) {
    const frontendURL = 'https://brogrammersmall.netlify.app/verifyEmail';
    const user = await User.findByEmailToken(emailToken);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    user.email_token = null;
    user.verified = true;
    await user.save();
    logVerifyEmail(user.email);
    
    // Redirect to the frontend URL

    res.redirect(frontendURL);
  }

  static async setRole(req, res) {
    try {
      const { role } = req.body;
      const { email } = req.params;
      await User.setRole(role, email);
      const user = await users.findOne({ where: { email } });
      const newNotification = {
        message: `you have been assigned new role which is ${role}`,
        type: 'user role updates',
      };
      const newN = { ...newNotification };
      newN.receiverId = user.id;
      const receiver = {
        username: user.username,
        email: user.email,
      };
      const notifyEmail = notificationTemplate2(
        receiver.username,
        newN.message,
        newN.type
      );
      sendEmail(
        emailConfig({
          email: receiver.email,
          subject: 'Notification !! role updates',
          content: notifyEmail,
        })
      );
      await notifications.create(newN);
      logSetRole(req, role);
      return res.status(200).json({
        status: 200,
        message: 'Role assigned to the user successfully',
      });
    } catch (error) {
      logError(req, error);
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  }

  /**
   * Login a user.
   * getting user information
   * @param {Object} req valiable
   * @param {Object} res valiable
   * @return {Object} res
   */
  static async login(req, res) {
    try {
      const user = await db.users.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      if (user.verified === false) {
        return res.status(401).json({ message: 'Email is not verified' });
      }
      if (user.disabledUser === true) {
        return res.status(401).json({ message: 'Your account is disabled!' });
      }
      if (user.mfa_enabled === false) {
        const token = jwt.sign(
          {
            email: req.body.email,
            id: user.id,
            mustUpdatePassword: user.mustUpdatePassword,
            username: user.username
          },
          JWT_SECRET
        );
        logLogin(user.email, user);
        return res.status(200).json({
          email: req.body.email,
          token,
          message: 'Login Successfully',
        });
      }

      // eslint-disable-next-line camelcase
      const mfa_code = await User.startMfaProcess(req.body.email);
      const mfaEmailContent = mfaEmailTemplate(mfa_code);
      User.sendMailWithNodemailer({
        email: req.body.email,
        subject: 'Brogrammers authentication code',
        content: mfaEmailContent,
      });
      logLogin(user.email, user);
      return res
        .status(200)
        .json({ message: 'Please check your email for authentication code' });
    } catch (error) {
      logError(req, error);
      res
        .status(500)
        .json({ error: error.message, message: 'Failed to login a user' });
    }
  }

  /**
   * Login a user.
   * getting user information
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static async getProfile(req, res) {
    try {
      const {
        avatar,
        mfa_enabled = false,
        cover_image,
        email,
        username,
        role,
        gender,
        id
      } = req.user;
      viewProfile(req, req.user);
      res.status(200).json({
        avatar,
        cover_image,
        mfa_enabled,
        email,
        username,
        role,
        gender,
        id
      });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ error: error.message, message: 'server error' });
    }
  }

  /**
   * Login a user.
   * getting user information
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static async editProfile(req, res) {
    try {
      const { error, value } = await User.editProfile(req.body, req.user);
      if (error) return res.status(400).json(error);
      const { avatar, cover_image, email, username, role, gender } = value;
      const token = Jwt.generateToken({ email });
      await db.users.update({ email_token: token }, { where: { email } });
      editProfiles(req, value);
      res.status(200).json({
        avatar,
        cover_image,
        email,
        username,
        role,
        gender,
        token,
        email_token: token,
      });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ error: error.message, message: 'server error' });
    }
  }

  static async enableMfa(req, res) {
    try {
      await db.users.update(
        { mfa_enabled: true },
        { where: { email: req.user.email } }
      );
      enableMfaLog(req);
      return res.status(200).json({
        message: 'Multi-factor authentication is enabled',
      });
    } catch (error) {
      logError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Failed to enable Multi-factor authentication',
      });
    }
  }

  static async disableMfa(req, res) {
    try {
      await db.users.update(
        { mfa_enabled: false },
        { where: { email: req.user.email } }
      );
      disableMfaLog(req);
      return res.status(200).json({
        message: 'Multi-factor authentication is disabled',
      });
    } catch (error) {
      logError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Failed to disable Multi-factor authentication',
      });
    }
  }

  static async verifyMfaCode(req, res) {
    try {
      const [isValid, message] = await User.isMfaValid(
        req.body.email,
        req.body.mfa_code
      );

      if (isValid) {
        const token = jwt.sign({ email: req.body.email }, JWT_SECRET);
        req.user = await users.findOne({ where: { email: req.body.email } });
        verifiedMfaLog(req, token);
        return res.status(200).json({ email: req.body.email, token });
      }

      return res.status(403).json({ message });
    } catch (error) {
      logError(req, error);
      return res.status(500).json({
        error: error.message,
        message: 'Failed to verify authentication code',
      });
    }
  }

  static async CreateAdmin(req, res) {
    try {
      const newAdminemail = req.params.email;
      const Nwuser = await users.findOne({ where: { email: newAdminemail } });
      if (!Nwuser) {
        return res.status(404).json({
          statusCode: 404,
          message: 'you are trying to make admin user that does not exist',
        });
      }
      Nwuser.role = 'admin';
      await Nwuser.save();
      const newNotification = {
        message: 'you have been assigned new role which is admin',
        type: 'user role updates',
      };
      const newN = { ...newNotification };
      newN.receiverId = Nwuser.id;
      const receiver = {
        username: Nwuser.username,
        email: Nwuser.email,
      };
      const notifyEmail = notificationTemplate2(
        receiver.username,
        newN.message,
        newN.type
      );
      sendEmail(
        emailConfig({
          email: receiver.email,
          subject: 'Notification !! ',
          content: notifyEmail,
        })
      );
      await notifications.create(newN);
      createAdminLog(req, Nwuser);
      res.status(200).json({
        user: Nwuser,
        message: `user ${Nwuser.username} sucessfully made admin`,
      });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ 'Error:': error });
    }
  }

  static async sendResetPasswordCode(req, res) {
    try {
      const { email, newPassword } = req.body;

      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // eslint-disable-next-line camelcase
      const resetToken = jwt.sign(
        { email, newPassword },
        process.env.RESET_PASSWORD_SECRET,
        { expiresIn: '1h' }
      );
      const resetPasswordContent = passwordResetEmailTemplate(resetToken);
      sendEmail(
        emailConfig({
          email,
          subject: 'Brogrammers reset password',
          content: resetPasswordContent,
        })
      );
      resetPasswordLog(req);
      res.status(200).json({ message: 'Check your email for reset link' });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ message: error.message });
    }
  }

  static async verifyResetPasswordCode(req, res) {
    try {
      const { resetToken } = req.params;
  
      if (resetToken) {
        jwt.verify(
          resetToken,
          process.env.RESET_PASSWORD_SECRET,
          async (err, decodedToken) => {
            if (err) {
              return res.redirect(`${process.env.FRONTEND}/verifyfail`);
            }
  
            const { email, newPassword } = decodedToken;
            const user = await users.findOne({ where: { email } });
            if (!user) {
              return res.redirect(`${process.env.FRONTEND}/verifyfail`);
            }
  
            user.verified = true;
            user.password = bcrypt.hashSync(newPassword, saltRounds);
            await user.save();
            verifyPasswordLog(req, user);
            return res.redirect(`${process.env.FRONTEND}/verifypass`);
          }
        );
      }
    } catch (error) {
      logError(req, error);
      res.redirect(`${process.env.FRONTEND}/verifyfail`);
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      // check if the old password matches the one in the database
      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        req.user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect old password' });
      }

      // validate the new password
      // eslint-disable-next-line operator-linebreak
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(401).json({
          message:
            'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.',
        });
      }

      // hash the new password and update the database
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      req.user.password = hashedPassword;
      req.user.lastTimePasswordUpdated = moment();
      req.user.mustUpdatePassword = false;
      await req.user.save();
      // Emit event to notify password update
      eventEmitter.emit('passwordUpdated', req.user);
      changePasswordLog(req, req.user);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      logError(req, error);
      res
        .status(500)
        .json({ error: error.message, message: 'Failed to change password' });
    }
  }
  // admin Disable user due to some reasons2

  static async disableUser(req, res) {
    try {
      const user = await users.findOne({ where: { id: req.params.userId } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.disabledUser = !user.disabledUser;
  
      if (user.disabledUser) {
        user.disabledReason = req.body.reason;
 
        sendEmail(
          emailConfig({
            email: user.email,
            subject: 'Your account has been disabled',
            // eslint-disable-next-line no-undef
            content: disableEmailTemplate(user.username, user.disabledReason),
          })
        );
        disableAccountLog(req, user);
      } else {
        user.disabledReason = null;
      }
        await user.save();

      const message = user.disabledUser ? 'User account disabled successfully' : 'User account enabled successfully';
      res.status(200).json({ message });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Logout a user by invalidating the JWT token.
   * @param {Object} req valiable
   * @param {Object} res valiable
   * @return {Object} res
   */
  static async logout(req, res) {
    try {
      await User.logout(req.headers.authorization);
      logLogout(req);
      res.status(200).json({ message: 'You logged out successfully' });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ message: error.message });
    }
  }

  static async googleAuthHandler(req, res) {
    const { value } = req.user.emails[0];
    const { familyName } = req.user.name;
    const newUser = {
      username: familyName,
      email: value,
      avatar: req.user.photos[0].value,
      verified: true,
      password: '12345',
    };
    const { id, email } = await User.registerGoogle(newUser);
    const userToken = jwt.sign({ email: email, id: id }, JWT_SECRET);
    redirectGoogle(email);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?key=${userToken}&email=${email}`
    );
  }

  static async updateAvatar(req, res) {
    try {
      const { error, value } = await User.updateAvatar(req.user, req.file);
      if (error) return res.status(400).json(error);
      const { avatar, cover_image, email, username, role, gender } = value;
      updateAvatarLog(req, value);
      res.status(200).json({
        avatar,
        cover_image,
        email,
        username,
        role,
        gender,
      });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ message: error.message });
    }
  }

  static async updateCoverImage(req, res) {
    try {
      const { error, value } = await User.updateCoverImage(req.user, req.file);
      if (error) return res.status(400).json(error);
      const { avatar, cover_image, email, username, role, gender } = value;
      updateImageLog(req, value);
      res.status(200).json({
        avatar,
        cover_image,
        email,
        username,
        role,
        gender,
      });
    } catch (error) {
      logError(req, error);
      res.status(500).json({ message: error.message });
    }
  }
}
