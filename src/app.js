/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import allroutes from './routes/index';
import swagger from './configs/swagger';
import checkPasswordExpirationCronJob from './middlewares/passwordExpiration';
import route from './routes/auth';
import beforeCheckExpiredProduct from './middlewares/productExpAll';

env.config();

const app = express();
checkPasswordExpirationCronJob.start();
beforeCheckExpiredProduct();

app.use(express.json());
app.use(cors());
app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', ['key2']],
  })
);
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', route);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

app.use(allroutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

export default app;
