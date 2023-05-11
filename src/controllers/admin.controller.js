/* eslint-disable require-jsdoc */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import User from '../services/user.services';
// eslint-disable-next-line import/named
import { users } from '../database/models';
import { Jwt } from '../helpers/jwt';
import { emailConfig } from '../helpers/emailConfig';
import { verifyEmailTemplate } from '../helpers/mailTemplate';
import { sendEmail } from '../helpers/mail';
import paginatedResults from '../middlewares/paginating';
import {
  updateUser,
  deleteUser,
  createUser,
  UserError,
  viewAllUsers,
} from '../loggers/Admin.logger';

const saltRounds = Number(process.env.SALTROUNDS) || 10;

export default class Admin {
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const {
        email, password, gender, role, verified, username
      } = req.body;

      if (email) user.email = email;
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, saltRounds);
      if (gender) user.gender = gender;
      if (role) user.role = role;
      if (verified) user.verified = verified;
      await user.save();
      await updateUser(req, user);
      return res.json({ data: user });
    } catch (error) {
      UserError(req, error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.destroy();
      await deleteUser(req, user);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      UserError(req, err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async signup(req, res) {
    try {
      const { email } = req.body;
      // eslint-disable-next-line object-shorthand
      const user = await users.findOne({ where: { email: email } });
      if (user) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const { data } = await User.registerAdmin(req.body);
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
      createUser(req, data);
      return res.status(201).json({
        message: 'Check your email to verify your account',
        user: data,
      });
    } catch (e) {
      UserError(req, e);
      return res.status(500).json({
        error: e.message,
        message: 'Failed to register a new user',
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      paginatedResults(users)(req, res, () => res.status(200).json(res.paginatedResults));
      viewAllUsers(req, res.paginatedResults);
    } catch (error) {
      UserError(req, error);
      return res.status(500).json({ error: error.message });
    }
  }
}
