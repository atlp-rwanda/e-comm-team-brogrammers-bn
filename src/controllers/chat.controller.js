/* eslint-disable require-jsdoc */
/* eslint-disable import/prefer-default-export */

// import { getMessages, addMessage } from '../services/chat.services';
import { SocketUtil } from '../helpers/socket';
import { ChatService } from '../services/chat.services';

export class ChatController {
  static async getAllMessages(req, res) {
    try {
      const messages = await ChatService.getMessages('brogrammers');
      return res
        .status(200)
        .json({ message: 'Fetched  messages', messages });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: 'Failed to fetch messages',
      });
    }
  }

  static async addSingleMessage(req, res) {
    try {
      const messages = await ChatService.saveMessage({
        room: 'brogrammers',
        userId: req.user.id,
        message: req.body.message,
      });
      const sentMessage = await ChatService.getOneMessage(messages.id);
      SocketUtil.socketEmit('message', sentMessage);
      return res.status(200).json({ message: 'Message sent.', messages });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: 'Failed to send a new message',
      });
    }
  }
}
