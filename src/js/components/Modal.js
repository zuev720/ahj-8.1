import FormLogin from './forms/FormLogin';

export default class Modal {
  constructor() {
    this.element = document.createElement('aside');
  }

  open() {
    this.element.className = 'modal-login';
    const modalHeader = document.createElement('h5');
    modalHeader.className = 'modal-header';
    modalHeader.textContent = 'Введите псевдоним';
    const form = document.createElement('form');
    form.className = 'modal-form';
    form.innerHTML = `
                     <label class="input-label">
                     <input name="login" class="input-login" type="text" required>
                     </label>
                     <div class="error-login"></div>
                     <button class="button-input-login" type="submit">Продолжить</button>`;
    this.element.append(modalHeader);
    document.documentElement.append(this.element);
    this.element.append(form);
    this.element.style.left = `${Math.round(document.documentElement.clientWidth / 2 - this.element.offsetWidth / 2)}px`;
    this.element.style.top = `${Math.round(document.documentElement.clientHeight / 2 - this.element.offsetHeight / 2)}px`;
    this.form = new FormLogin(this.element.querySelector('.modal-form'));
  }

  closeAndDelete() {
    this.element.remove();
  }
}
