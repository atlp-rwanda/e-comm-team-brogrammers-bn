/* eslint-disable no-console */
import env from 'dotenv';
import http from 'http';
// eslint-disable-next-line import/named
import { sequelize } from './database/models/index';
import app from './app';
import { SocketUtil } from './helpers/socket';

env.config();
const port = process.env.PORT || 6000;
const server = http.createServer(app);
SocketUtil.config(server);

server.listen(port, () => {
  console.log('server started,', port);
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
app.emit('appStarted \n');
export default app;
