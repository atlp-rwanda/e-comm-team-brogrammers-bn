/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import nodemailer from 'nodemailer';
// eslint-disable-next-line import/named
import { users } from '../database/models';

const saltRounds = Number(process.env.SALTROUNDS) || 10;

/**
 * class for all user services
 */
export default class User {
  /**
   * function to register user
   * @param {Object} data the information for user to be created
   * @returns {data} for the created user
   */
  static async register(data) {
    data.password = await bcrypt.hash(data.password, saltRounds);

    const { username, email, password, gender, email_verified } = data;
    const user = await users.create({
      username,
      email,
      password,
      gender,
      email_verified,
    });

    return { data: user };
  }

  static async startMfaProcess(email) {
    const user = await users.findOne({ where: { email } });
    user.mfa_code = Math.floor(Math.random() * 100000 + 10000);
    const timeout = (process.env.MFA_MINS || 3) * 60 * 1000;
    user.mfa_timeout = new Date(Date.now() + timeout);
    await user.save();
    return user.mfa_code;
  }

  static async isMfaValid(email, mfa_code) {
    const user = await users.findOne({ where: { email } });
    if (user.mfa_code !== mfa_code) {
      return [false, 'Invalid authentication code'];
    }
    if (user.mfa_timeout < new Date()) {
      return [false, 'Authentication code expired'];
    }

    // Force mfa code to expire after usage
    user.mfa_timeout = new Date(Date.now() - 10 * 60 * 1000);
    await user.save();
    return [true];
  }

  static async findByEmailToken(emailToken) {
    const user = await users.findOne({ where: { email_token: emailToken } });
    return user;
  }

  static async updateUser(fields, id) {
    // eslint-disable-next-line no-return-await
    return await users.update({ ...fields }, { where: { id: id } });
  }

  static async editProfile(data, user) {
    const { email } = data;
    if (email && email !== null && email !== user.email) {
      const exist = await users.findOne({ where: { email } });
      if (exist && exist !== null) return { error: 'email exists' };
    }
    const {
      role,
      password,
      id,
      verified, // unchangeble fields in here
      ...fields // changeble fields
    } = data;

    await this.updateUser(data, user.id);
    const newUsers = { ...user.dataValues, ...data };
    return { value: newUsers };
  }

  static async sendMailWithNodemailer({ email, subject, content }) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: email,
      subject,
      html: content,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return err;
    });
  }

  static async setRole(role, email) {
    await users.update({ role }, { where: { email } });
  }

  static async findById(id) {
    const user = await users.findOne({ where: { id: `${id}` } });
    return user;
  }
}
