import jwt from 'jsonwebtoken';
// eslint-disable-next-line import/named
import model, { users } from '../database/models';

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const dotenv = require('dotenv');

dotenv.config();
const route = express.Router();
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: process.env.CALLBACKURL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => done(null, profile)
  )
);

route.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

route.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/auth/profile',
  })
);

// eslint-disable-next-line no-use-before-define
route.get('/profile', successGoogleLogin);
/**
 * @param {Object} req
 * @param {Object} res
 * @returns {res} res
 */
async function successGoogleLogin(req, res) {
  if (!req.user) return res.redirect('/auth/login');
  try {
    // eslint-disable-next-line no-underscore-dangle
    const userObj = req.user._json;
    const user = await model.users.findOne({ where: { email: userObj.email } });
    if (!user) {
      const newUser = await users.create({
        // eslint-disable-next-line camelcase
        username: userObj.name,
        email: userObj.email,
        password: '12345',
        email_verified: true,
      });
      const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);
      return res.status(201).json({ user: newUser, token });
    }
    const newUser = user;
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);
    res.status(200).json({
      message: 'success',
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json(err);
  }
}

route.get('/login', (req, res) => {
  res.send('Please login with Google <a href="/auth/google">here</a>.');
});

route.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default route;
