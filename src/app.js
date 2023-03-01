import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import allroutes from './routes/index';

env.config();

// Testing if the db connection works when running from docker container
// Feel free to comment it, if not using docker yet
import { connectDB } from './db';
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(allroutes);
app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' });
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log('server started,', port);
});

export default app;
