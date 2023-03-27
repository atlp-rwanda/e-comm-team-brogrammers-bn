/* eslint-disable require-jsdoc */
const users = [];

// Join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };
  if (
    users.length === 0 || users.filter((u) => u.id === user.id).length === 0
  ) {
    users.push(user);
  }
  return user;
};

// Get current user
const getCurrentUser = (id) => users.find((user) => user.id === id);

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getRoomUsers = (room) => users.filter((user) => user.room === room);

export {
  userJoin, getCurrentUser, userLeave, getRoomUsers
};
