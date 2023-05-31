/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import path from 'path';
import allroutes from './routes/index';
import swagger from './configs/swagger';
import checkPasswordExpirationCronJob from './middlewares/passwordExpiration';
import beforeCheckExpiredProduct from './middlewares/productExpAll';
import dbRoutes from './pgbackup/route';
import './pgbackup/backup';
import { SubscriberController } from './controllers/subscriber.controller';

env.config();
// eslint-disable-next-line prefer-const
let options = {
  validatorUrl: null,
  oauth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    appName: 'project-966788183307',
  },
};

const app = express();
checkPasswordExpirationCronJob.start();
beforeCheckExpiredProduct();
SubscriberController.sendNewsletter();
app.use(express.json());
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.CAT,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger, false, options));
app.use('/database', dbRoutes);
app.use(allroutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

export default app;
