import { users } from '../database/models';

const checkUserExist = async (req, res, next) => {
  try {
    const user = await users.findOne({ where: { email: req.body.email || 'undefined' } });
    if (user && user !== null) return res.status(400).json({ message: 'email exists' });

    next();
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default checkUserExist