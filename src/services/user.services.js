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
  /**

function to update user password
@param {Number} id the user id
@param {String} currentPassword the current user password
@param {String} newPassword the new user password
@returns {Object} the updated user object
*/
static async updatePassword(id, currentPassword, newPassword) {
  const user = await users.findByPk(id);
  if (!user) {
    throw new Error(`User with id ${id} not found.`);
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    throw new Error('Current password does not match.');
  }

  const isPasswordValid = UserService.isPasswordValid(newPassword);
  if (!isPasswordValid) {
    throw new Error('Invalid password.');
  }

  const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = newHashedPassword;
  await user.save();

  return user;
}
static isPasswordValid(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
}

  static async findByEmailToken(emailToken) {
    const user = await users.findOne({ where: { email_token: emailToken } });
    return user;
  }
}
