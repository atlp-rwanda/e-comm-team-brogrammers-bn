import { Server } from 'socket.io';

export class SocketUtil {
  static io;
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