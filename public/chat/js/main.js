/* eslint-disable no-empty */
/* eslint-disable no-restricted-globals */
/* eslint-disable require-jsdoc */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const msgInput = document.getElementById('msg');
const typing = document.getElementById('typing');

// Get email, password and room from URL
// eslint-disable-next-line no-restricted-globals
const { email, room, password } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

let token = '',
  timeout;

const signIn = async () => {
  localStorage.removeItem('accessToken');
  const data = {
    email,
    password
  };
  const response = await fetch('/users/login', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.status === 200) {
    const result = await response.json();
    token = result.token;
    localStorage.setItem('accessToken', token);
  } else {
    alert('invalid credential,Try again');
    window.location.replace('./index.html');
    return false;
  }
};

signIn();

setTimeout(() => {
  token = localStorage.getItem('accessToken');
  loadMessages();
}, 3000);

const loadMessages = () => {
  const socket = io({
    auth: {
      token
    }
  });

  // Join chatroom
  socket.emit('joinRoom', { email, room });

  // Get room and users
  socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

  // Message from server
  socket.on('message', ({
    room, message, username, createdAt
  }) => {
    outputMessage({
      room, message, username, createdAt
    });
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // All Messages from server
  socket.on('messages', (messages) => {
    outputMessages(messages);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function timeoutFunction() {
    socket.emit('typing', false);
  }
  msgInput.addEventListener('keyup', () => {
    socket.emit('typing', email);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 2000);
  });
  socket.on('typing', (user) => {
    if (user) {
      typing.innerHTML = `${user} is typing...`;
    } else {
      typing.innerHTML = '';
    }
  });

  // Message submit
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
      return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });

  // Output message to DOM
  function outputMessage({ room, message, createdAt }) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = room;
    p.innerHTML += `<span>${createdAt}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }

  function outputMessages(messages) {
    if (Array.isArray(messages)) {
      messages.forEach((el) => {
        const div = document.createElement('div');
        div.classList.add('message');
        const p = document.createElement('p');
        p.classList.add('meta');
        p.innerText = el.user.username;
        p.innerHTML += `<span> sent ${new Date(
          el.createdAt
        ).toLocaleString()} </span>`;
        div.appendChild(p);
        const para = document.createElement('p');
        para.classList.add('text');
        para.innerText = el.message;
        div.appendChild(para);
        document.querySelector('.chat-messages').prepend(div);
      });
    }
  }
};

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../chat/index.html';
  } else {
  }
});
