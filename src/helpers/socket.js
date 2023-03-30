/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import socketio from 'socket.io';
import { findById } from '../services/user.services';
import { Jwt } from './jwt';
import { addMessage, getMessages } from '../services/chat.services';
import { formatMessage } from './chat/message';
import {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} from './chat/user';

const io = socketio();

const chatName = 'brogrammers';
let currentUser, user;

io.use(async (socket, next) => {
  const { token } = socket.handshake.auth;
  if (token) {
    currentUser = await Jwt.verifyToken(token);
    if (currentUser) {
      return next();
    }
    return next(new Error('You are not logged in!'));
  }
});

io.on('connection', async (socket) => {
  const { id: userId, username, } = await findById(currentUser.value.id);
  const user = userJoin(userId, username, chatName);
  socket.join(user.room);

  const messages = await getMessages(user.room);

  socket.emit(
    'messages',
    messages.map((el) => el.dataValues)
  );
  socket.broadcast
    .to(user.room)
    .emit(
      'message',
      formatMessage(chatName, `${user.username} has joined the chat`)
    );

  // Send users and room info
  io.to(user.room).emit('roomUsers', {
    room: user.room,
    users: getRoomUsers(user.room)
  });

  // Listen for chatMessage
  socket.on('chatMessage', async (msg) => {
    const currentUser = getCurrentUser(userId);
    io.to(user.room).emit(
      'message',
      formatMessage(username, msg)
    );

    const message = await addMessage({
      userId: user.id,
      room: user.room,
      message: msg
    });
  });

  socket.on('typing', (msg) => {
    socket.broadcast.emit('typing', msg);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(userId);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(chatName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
export default io;
