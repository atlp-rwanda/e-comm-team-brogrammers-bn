import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from '../database/models';

dotenv.config();

const router = express.Router();

// eslint-disable-next-line operator-linebreak

router.post('/login', async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(401).send({ message: 'Incorrect email or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: 'Incorrect email or password.' });
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

  res.status(200).send({ id: user.id, email: user.email, token });
});

export default router;
