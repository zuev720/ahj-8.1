export default class FormChat {
  constructor(element, login, websocket) {
    if (!element) {
      throw new Error('Формы для чата не существует!');
    }
    this.form = element;
    this.login = login;
    this.ws = websocket;
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  onSubmit(e) {
    e.preventDefault();
    const message = e.target.querySelector('.input-messages').value.trim();
    this.ws.send(JSON.stringify({ type: 'message', login: this.login, message }));
    e.target.querySelector('.input-messages').value = '';
  }
}
