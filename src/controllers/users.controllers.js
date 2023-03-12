import User from '../services/user.services';

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
      return res.status(200).json({ message: 'user created successful', data });
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  /**

update user's password
@param {Object} req valiable
@param {Object} res valiable
@return {Object} res
*/
static async updatePassword(req, res) {
  const { id, currentPassword, newPassword } = req.body;
  try {
    const user = await User.updatePassword(id, currentPassword, newPassword);
    return res.status(200).json({ message: 'password updated successful', data: { user } });
  } catch (e) {
    return res.status(500).json(e);
  }
 }
}
