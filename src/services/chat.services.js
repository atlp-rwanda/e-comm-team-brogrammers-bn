/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
import { Chat, users } from '../database/models';

export class ChatService {
  static async saveMessage(newMessage) {
    const message = await Chat.create(newMessage);
    return message;
  }

  static async getOneMessage(id) {
    const newMessage = await Chat.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: 'user',
          attributes: ['username'],
        },
      ],
    });
    return newMessage;
  }

  static async getMessages(room) {
    try {
      return Chat.findAll({
        where: { room },
        include: [
          {
            model: users,
            as: 'user',
            attributes: ['username'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      return { error };
    }
  }
}
