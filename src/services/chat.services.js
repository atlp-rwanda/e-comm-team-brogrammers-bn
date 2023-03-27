/* eslint-disable import/named */
/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
import { Chat, users } from '../database/models';

export const addMessage = async (data) => {
  try {
    return Chat.create({ ...data });
  } catch (error) {
    return { error };
  }
};

export const getMessages = async (room) => {
  try {
    return Chat.findAll({
      where: { room },
      include: [
        {
          model: users,
          as: 'user',
          attributes: ['username']
        }
      ]
    });
  } catch (error) {
    return { error };
  }
};
