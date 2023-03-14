import jwt from 'jsonwebtoken';
import model from '../database/models';

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
  '/auth/google',
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
    if (userObj.verified !== true) {
      return res
        .status(401)
        .json({ message: 'Email not verified', error: true });
    }
    const user = await model.users.findOne({ where: { email: userObj.email } });
    if (!user) res.status(404).json({ user: userObj, message: 'sign up' });
    else {
      const newUser = user.dataValues;
      delete newUser.password;
      const token = jwt.sign(newUser, process.env.SECRET_KEY);
      res.status(200).json({
        message: 'success',
        token,
        role: user.role,
      });
    }
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
