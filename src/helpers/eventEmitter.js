const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

// Registering a listener for the 'passwordUpdated' event
// eslint-disable-next-line no-unused-vars
eventEmitter.on('passwordUpdated', (userId) => {
});

module.exports = eventEmitter;
