/* eslint-disable no-unused-vars */
/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */
import bcrypt from 'bcrypt';
// eslint-disable-next-line import/named
import { users } from '../database/models';

const saltRounds = Number(process.env.SALTROUNDS);

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

    const {
      // eslint-disable-next-line camelcase
      username, email, password, gender, email_verified
    } = data;
    const user = await users.create({
      // eslint-disable-next-line camelcase
      username, email, password, gender, email_verified
    });

    return { data: user };
  }

  static async findByEmailToken(emailToken) {
    const user = await users.findOne({ where: { email_token: emailToken } });
    return user;
  }

  static async updateUser(fields, id) {
    // eslint-disable-next-line no-return-await
    return await User.update({ ...fields }, { where: { id: id } });
  }
}
