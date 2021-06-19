import EventBus from '../../pub-sub/eventBus';

export default class FormLogin {
  constructor(element) {
    if (!element) {
      throw new Error('Формы для логина не существует!');
    }
    this.form = element;
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  }

  async onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = new URL('https://ahj-ws-backend.herokuapp.com');
    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.login === false) {
      this.form.querySelector('.error-login').textContent = result.message;
      e.target.querySelector('.input-login').value = '';
    } else {
      EventBus.publish('login', result);
      this.form.remove();
    }
  }
}
