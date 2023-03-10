/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import allroutes from './routes/index';
import swagger from './configs/swagger';

env.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagger));

app.use(allroutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Page not found' });
});

export default app;
