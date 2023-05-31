/* eslint-disable import/named */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../controllers/users.controllers';
import { users, Subscriber } from '../database/models';

const checkUserExist = async (req, res, next) => {
  try {
    const user = await users.findOne({ where: { email: req.body.email || 'undefined' } });
    if (user && user !== null) return res.status(400).json({ message: 'email exists' });

    next();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const checkSubscriberExist = async (req, res, next) => {
  try {
    const user = await Subscriber.findOne({ where: { email: req.body.email || 'undefined' } });
    if (user && user !== null) return res.status(400).json({ message: 'You already subscribed with that email' });
    next();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export const checkUserByEmail = async (req, res, next) => {
  const user = await users.findOne({
    where: { email: req.user.emails[0].value },
  });
  if (user && typeof req.user.photos !== 'undefined') {
    const { id, email } = user;
    const userToken = jwt.sign({ email, id }, JWT_SECRET);
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?key=${userToken}&email=${email}`
    );
  }
  next();
};

export default checkUserExist;
