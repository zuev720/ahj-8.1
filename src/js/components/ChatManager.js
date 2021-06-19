import Modal from './Modal';
import EventBus from '../pub-sub/eventBus';
import FormChat from './forms/FormChat';

export default class ChatManager {
  constructor(element) {
    if (typeof element === 'string') this.container = document.querySelector(element);
    EventBus.subscribe('login', this.login.bind(this));
    this.container = element;
    this.chatMessagesBlock = this.container.querySelector('.display-messages-block');
    this.currentUsers = [];
    this.chatMessages = [];
    this.ws = null;
    this.login = null;
    this.modal = null;
    this.init().then((r) => r);
  }

  async init() {
    if (localStorage.getItem('login')) {
      this.login = localStorage.getItem('login');
      const url = new URL(`https://ahj-ws-backend.herokuapp.com/?method=login&login=${this.login}`);
      const response = await fetch(url.toString());
      const result = await response.json();
      this.chatMessages = result;
      this.start();
    } else {
      this.modal = new Modal();
      this.modal.open();
    }
  }

  registerEvents() {
    this.ws.addEventListener('message', (response) => this.wsOnMessage(response));
    window.addEventListener('unload', () => this.ws.send(JSON.stringify({
      type: 'close',
      login: this.login,
    })));
  }

  login(object) {
    this.modal.closeAndDelete();
    this.login = object.message;
    this.chatMessages = object.allMessages;
    this.start();
  }

  start() {
    localStorage.setItem('login', this.login);
    this.ws = new WebSocket('ws://ahj-ws-backend.herokuapp.com');
    this.registerEvents();
    this.drawChat();
    this.formChat = new FormChat(this.container.querySelector('.form-input-messages'), this.login, this.ws);
  }

  wsOnMessage(response) {
    const message = JSON.parse(response.data);
    if (message.type === 'users') this.drawUsers(message);
    if (message.type === 'message') this.drawChat(message);
  }

  drawChat(obj = null) {
    this.chatMessagesBlock.innerHTML = '';
    if (obj) this.chatMessages.push(obj.message);
    this.chatMessages.forEach((message) => {
      const messageBlock = document.createElement('div');
      messageBlock.className = 'message-block';
      const userInfo = document.createElement('span');
      userInfo.className = 'user-info';
      const messageBody = document.createElement('p');
      messageBody.className = 'message';
      messageBlock.insertAdjacentElement('afterbegin', userInfo);
      messageBlock.insertAdjacentElement('beforeend', messageBody);
      let userInfoContent;
      if (message.login === this.login) {
        messageBlock.dataset.user = 'myself';
        userInfoContent = `You, ${message.time}`;
      } else {
        userInfoContent = `${message.login}, ${message.time}`;
      }
      userInfo.textContent = userInfoContent;
      messageBody.textContent = message.message;
      this.chatMessagesBlock.append(messageBlock);
    });
  }

  drawUsers(obj) {
    if (obj.users.length < this.currentUsers.length) this.currentUsers = obj.users;
    else {
      const newUsers = obj.users.filter((user) => !this.currentUsers.includes(user));
      this.currentUsers = [...this.currentUsers, ...newUsers];
    }
    this.container.style.display = 'flex';
    const usersBlock = this.container.querySelector('.display-users');
    usersBlock.innerHTML = '';
    this.currentUsers.forEach((user) => {
      const userBlock = document.createElement('div');
      userBlock.className = 'user-block';
      const statusUser = document.createElement('div');
      statusUser.className = 'status-user';
      userBlock.insertAdjacentElement('afterbegin', statusUser);
      const userName = document.createElement('span');
      userName.className = 'user-name';
      userBlock.insertAdjacentElement('beforeend', userName);
      usersBlock.append(userBlock);
      if (user === this.login) {
        userName.textContent = 'You';
        userName.style.color = 'red';
      } else userName.textContent = user;
    });
  }
}
