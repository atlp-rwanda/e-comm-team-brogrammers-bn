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
import { users } from '../database/models';
/* eslint-disable require-jsdoc */
import { Jwt } from '../helpers/jwt';
import { emailConfig } from '../helpers/emailConfig';
import {
  verifyEmailTemplate,
  mfaEmailTemplate,
  passwordResetEmailTemplate,
  disableEmailTemplate,
} from '../helpers/mailTemplate';
import { sendEmail } from '../helpers/mail';

// eslint-disable-next-line operator-linebreak
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
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
      return res.status(201).json({
        message: 'Check your email to verify your account',
        user: data,
        signupToken,
      });
    } catch (e) {
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
      res.status(500).json({ 'Error:': error });
    }
  }

  static async verifyUser(emailToken, res) {
    const user = await User.findByEmailToken(emailToken);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    user.email_token = null;
    user.verified = true;
    await user.save();
    res.status(200).send({
      message: 'Your account has been verified successfully!',
      verified: true,
    });
  }

  static async setRole(req, res) {
    try {
      const { role } = req.body;
      const { email } = req.params;
      await User.setRole(role, email);
      return res.status(200).json({
        status: 200,
        message: 'Role assigned to the user successfully',
      });
    } catch (error) {
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
        return res.status(403).json({ message: 'Email is not verified' });
      }
      if (user.disabledUser === true) {
        return res.status(403).json({ message: 'Your account is disabled!' });
      }

      if (user.mfa_enabled === false) {
        const token = jwt.sign({ email: req.body.email, id: user.id }, JWT_SECRET);
        return res.status(200).json({ email: req.body.email, token });
      }

      // eslint-disable-next-line camelcase
      const mfa_code = await User.startMfaProcess(req.body.email);
      const mfaEmailContent = mfaEmailTemplate(mfa_code);
      User.sendMailWithNodemailer({
        email: req.body.email,
        subject: 'Brogrammers authentication code',
        content: mfaEmailContent,
      });
      return res
        .status(200)
        .json({ message: 'Please check your email for authentication code' });
    } catch (error) {
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
      const { email, username, role, gender } = req.user;
      res.status(200).json({
        email,
        username,
        role,
        gender,
      });
    } catch (error) {
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
      const { email, username, role, gender } = value;
      const token = Jwt.generateToken({ email });
      await db.users.update({ email_token: token }, { where: { email } });
      res.status(200).json({
        email,
        username,
        role,
        gender,
        token,
        email_token: token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'server error' });
    }
  }

  static async enableMfa(req, res) {
    try {
      await db.users.update(
        { mfa_enabled: true },
        { where: { email: req.user.email } }
      );

      return res.status(200).json({
        message: 'Multi-factor authentication is enabled',
      });
    } catch (error) {
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

      return res.status(200).json({
        message: 'Multi-factor authentication is disabled',
      });
    } catch (error) {
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
        return res.status(200).json({ email: req.body.email, token });
      }

      return res.status(403).json({ message });
    } catch (error) {
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
      res.status(200).json({
        user: Nwuser,
        message: `user ${Nwuser.username} sucessfully made admin`,
      });
    } catch (error) {
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

      res.status(200).json({ message: 'Check your email for reset link' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send reset link' });
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
              return res
                .status(403)
                .json({ message: 'Invalid password reset token' });
            }

            const { email, newPassword } = decodedToken;
            const user = await users.findOne({ where: { email } });
            if (!user) {
              return res.status(404).json('User not found');
            }

            user.verified = true;
            user.password = bcrypt.hashSync(newPassword, saltRounds);
            user.save();
            return res
              .status(200)
              .json({ message: 'Password reset successful' });
          }
        );
      }
    } catch (error) {
      res.status(500).json({
        message:
          error.message
          || error.toString()
          || 'Failed to verify password reset link',
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      // check if the old password matches the one in the database
      const isPasswordValid = bcrypt.compareSync(
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
        return res.status(400).json({
          message:
            'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.',
        });
      }

      // hash the new password and update the database
      const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);
      req.user.password = hashedPassword;
      req.user.lastTimePasswordUpdated = moment();
      req.user.mustUpdatePassword = false;
      await req.user.save();
      // Emit event to notify password update
      eventEmitter.emit('passwordUpdated', req.user);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
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
      if (user.disabledUser) {
        return res.status(400).json({ message: 'user is already disabled' });
      }
      user.disabledUser = true;
      user.disabledReason = req.body.reason;

      await user.save();

      sendEmail(emailConfig({
        email: user.email,
        subject: 'Your account has been disabled',
        // eslint-disable-next-line no-undef
        content: disableEmailTemplate(user.username, user.disabledReason)
      }));

      res.status(200).json({ message: 'User account disabled successfully' });

      // res.json(user);
    } catch (error) {
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
      res.status(200).json({ message: 'You logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
