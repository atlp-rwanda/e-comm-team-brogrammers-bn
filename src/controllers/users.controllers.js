import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../services/user.services';
// eslint-disable-next-line import/no-duplicates
import db from '../database/models';

// eslint-disable-next-line import/named, import/no-duplicates
import { users } from '../database/models';
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

      const token = jwt.sign({ email: user.email }, JWT_SECRET);

      res.status(200).json({ id: user.id, email: user.email, token });
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
      const {
        email, username, role, gender
      } = req.user;
      res
        .status(200)
        .json({
          email, username, role, gender
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, message: 'server error' });
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
      const other = {};
      const {
        role: userRole,
        email_token: userEmailToken,
        password, id, verified, // unchangeble fields in here
        ...fields // changeble fields
      } = req.body;

      const { email: otherEmail } = fields;
      if (otherEmail && otherEmail !== null && otherEmail !== req.user.email) {
        const exist = await db.users.findOne({ where: { email: otherEmail } });
        if (exist && exist !== null) return res.status(400).json({ error: 'email exists' });

        const userToken = Jwt.generateToken({ data: req.user }, '1h');
        const token = Jwt.generateToken({ email: otherEmail });
        if (userToken) {
          fields.email_token = userToken;
          other.token = token;
          fields.verified = false;
        }
        const verificationEmail = verifyEmailTemplate(userToken);
        sendEmail(
          emailConfig({
            email: otherEmail,
            subject: 'Brogrammers email verification',
            content: verificationEmail,
          })
        );
      }

      const { error, value } = await User.editProfile(fields, req.user);
      if (error) return res.status(400).json(error);
      const {
        email, username, role, gender
      } = value;
      res
        .status(200)
        .json({
          ...other, ...fields, email, username, role, gender
        });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, message: 'server error' });
    }
  }

  static async CreateAdmin(req, res) {
    try {
      const newAdminemail = req.params.email;
      const Nwuser = await users.findOne({ where: { email: newAdminemail } });
      if (!Nwuser) {
        return res
          .status(404)
          .json({
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
  
  static async changePassword(req, res) {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // check if the email exists in the database
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // check if the old password matches the one in the database
      const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect old password' });
      }
      
       // validate the new password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.',
      });
    }
      // hash the new password and update the database
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message, message: 'Failed to change password' });
    }
  }
}
