/* eslint-disable require-jsdoc */
/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-extraneous-dependencies
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class Jwt {
  static generateToken(data, exp = '1y') {
    return JWT.sign(data, process.env.JWT_SECRET, { expiresIn: exp });
  }

  static verifyToken(token) {
    return JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return { error: err };
      }
      return { value: decoded };
    });
  }
}
