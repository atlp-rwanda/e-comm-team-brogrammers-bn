/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-unresolved */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const googlePass = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: ['profile', 'email'],
        passReqToCallback: true,
      },
      (request, accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
