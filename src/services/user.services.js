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
      username, email, password, gender
    } = data;
    const user = await users.create({
      username, email, password, gender
    });

    return { data: user };
  }
}