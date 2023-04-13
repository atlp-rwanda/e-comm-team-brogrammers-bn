/* eslint-disable object-shorthand */
// eslint-disable-next-line import/named
import { users, Subscriber } from '../database/models';
import { Jwt } from '../helpers/jwt';

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
    if (user && user !== null) return res.status(400).json({ message: 'email exists' });
    next();
  } catch (e) {
    return res.status(500).json(e);
  }
};
export const checkUserByEmail = async (req, res, next) => {
  const user = await users.findOne({
    where: { email: req.user.emails[0].value },
  });
  if (user) {
    const { id, email, role } = user;
    const token = Jwt.generateToken({
      id: id,
      email: email,
      role: role,
    });
    return res.redirect(`/users/redirect?key=${token}`);
  }
  next();
};

export default checkUserExist;
