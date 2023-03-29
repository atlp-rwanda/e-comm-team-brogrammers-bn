/* eslint-disable */
import { Server } from 'socket.io';

export class SocketUtil {
  // static io = {};
  constructor() {}
  static socketEmit(key, data) {
    SocketUtil.io.sockets.emit(key, data);
  }
  static config(server) {
    SocketUtil.io = new Server(server, { cors: { origin: '*' } });

    SocketUtil.io.on('connection', () => {});
    SocketUtil.io.on('disconnect', () => {});
  }
}
export const knownSockets = {
  notification: 'notification',
};
