const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

// eslint-disable-next-line no-unused-vars
eventEmitter.on('passwordUpdated', (userId) => {
});

module.exports = eventEmitter;
