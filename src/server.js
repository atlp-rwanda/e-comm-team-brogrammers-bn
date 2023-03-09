import env from 'dotenv';
// eslint-disable-next-line import/named
import { sequelize } from './database/models/index';
import app from './app';

env.config();
const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log('server started,', port);
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
export default app;
