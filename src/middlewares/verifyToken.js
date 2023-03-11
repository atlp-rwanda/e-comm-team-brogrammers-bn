import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// eslint-disable-next-line import/named
import { users } from '../database/models';

dotenv.config();
/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next next to other function
 * @returns {object} response if error
 */
function isAuthenticated(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ statusCode: 401, message: 'Please Login' });
    }
    console.log(authorization.split(' ')[1]);
    const token = authorization.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          return res.status(401).json('Please login');
        }
        {
          const { email } = decodedToken;
          console.log(decodedToken);
          const user = await users.findOne({ email });
          if (!user) {
            return res.status(401).json('You are not Authorized');
          }
          req.user = user;
          next();
        }
      });
    } else {
      req.user = null;
      return res.status(401).json({ statusCode: 401, message: 'Please Login' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

export default isAuthenticated;
