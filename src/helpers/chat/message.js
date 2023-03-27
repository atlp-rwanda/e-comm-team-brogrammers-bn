/* eslint-disable import/prefer-default-export */
/* eslint-disable require-jsdoc */
import moment from 'moment';

function formatMessage(room, message, username) {
  return {
    room,
    message,
    username,
    createdAt: moment().format('h:mm a')
  };
}

export { formatMessage };
