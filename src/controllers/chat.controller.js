/* eslint-disable require-jsdoc */
/* eslint-disable import/prefer-default-export */

import { getMessages, addMessage } from '../services/chat.services';

export class ChatController {
  static async getAllMessages(req, res) {
    try {
      const messages = await getMessages('brogrammers');
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
      const messages = await addMessage({
        room: 'brogrammers',
        userId: req.user.id,
        message: req.body.message,
      });
      return res.status(200).json({ message: 'Message sent.', messages });
    } catch (err) {
      return res.status(500).json({
        error: err.message,
        message: 'Failed to send a new message',
      });
    }
  }
}
