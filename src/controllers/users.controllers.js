/* eslint-disable import/no-named-as-default */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-named-as-default-member
import User from '../services/user.services';
import db from '../database/models';
/* eslint-disable require-jsdoc */
/* eslint-disable require-jsdoc */
import { Jwt } from '../helpers/jwt';
import { emailConfig } from '../helpers/emailConfig';
import { verifyEmailTemplate } from '../helpers/mailTemplate';
import { sendEmail } from '../helpers/mail';

// eslint-disable-next-line operator-linebreak
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

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
    res.status(200).send({ message: 'Your account has been verified successfully!', verified: true });
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

      const token = jwt.sign({ ...user }, JWT_SECRET);

      res.status(200).json({ id: user.id, email: user.email, token });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, message: 'Failed to login a user' });
    }
  }
}
