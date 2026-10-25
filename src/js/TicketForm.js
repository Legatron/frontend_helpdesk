/**
 * Класс для создания и управления модальной формой тикета.
 */
export default class TicketForm {
  constructor({ title, name = '', description = '', onSubmit, onCancel }) {
    this.title = title;
    this.name = name;
    this.description = description;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.element = this._createElement();
  }

  _createElement() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__content">
        <h2 class="modal__title">${this.title}</h2>
        <form class="modal__form">
          <label class="modal__label">
            Краткое описание
            <input type="text" name="name" class="modal__input" value="${this.name}" required>
          </label>
          <label class="modal__label">
            Подробное описание
            <textarea name="description" class="modal__textarea">${this.description}</textarea>
          </label>
          <div class="modal__actions">
            <button type="button" class="modal__cancel">Отмена</button>
            <button type="submit" class="modal__submit">Ok</button>
          </div>
        </form>
      </div>
    `;

    const form = modal.querySelector('.modal__form');
    const cancelBtn = modal.querySelector('.modal__cancel');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
      };
      if (!data.name) return;
      this.onSubmit(data);
      this.close();
    });

    cancelBtn.addEventListener('click', () => {
      this.onCancel?.();
      this.close();
    });

    return modal;
  }

  open() {
    document.body.appendChild(this.element);
  }

  close() {
    this.element.remove();
  }
}
