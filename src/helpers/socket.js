/* eslint-disable require-jsdoc */

import { Server } from 'socket.io';
import { ChatService } from '../services/chat.services';

// eslint-disable-next-line import/prefer-default-export
export class SocketUtil {
  static socketEmit(key, data) {
    this.io.sockets.emit(key, data);
  }

  static config(server) {
    this.io = new Server(server, { cors: { origin: '*' } });

    this.io.on('connection', (socket) => {
      socket.on('join_room', (data) => {
        socket.join(data);
      });
      socket.on('send_message', async (newMessage) => {
        const sentMessage = await ChatService.getOneMessage(newMessage.data.user.id);
        socket.to(newMessage.room).emit('receive_message', sentMessage);
      });
      socket.on('typing', (data) => {
        socket.broadcast.emit('istyping', data);
      });

      socket.on('disconnect', () => {
      });
    });
  }
}
