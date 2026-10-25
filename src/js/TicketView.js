/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */

export default class TicketView {
  /**
   * @param {Object} ticket - объект тикета
   * @param {boolean} isShort - если true, не показывать описание (для списка)
   * @returns {string} HTML-строка
   */
  static render(ticket, isShort = true) {
    const { id, name, status, created, description } = ticket;
    const date = new Date(created).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const checkedClass = status ? 'ticket--done' : '';
    const checkIcon = status ? '<span class="ticket__check">✓</span>' : '<span class="ticket__check"></span>';

    const descriptionBlock = !isShort && description ? `<div class="ticket__description">${description}</div>` : '';

    return `
      <div class="ticket ${checkedClass}" data-id="${id}">
        <div class="ticket__header">
          <div class="ticket__status" data-action="toggle">${checkIcon}</div>
          <div class="ticket__name">${name}</div>
          <div class="ticket__date">${date}</div>
          <div class="ticket__actions">
            <button class="ticket__edit" data-action="edit">✎</button>
            <button class="ticket__delete" data-action="delete">×</button>
          </div>
        </div>
        ${descriptionBlock}
      </div>
    `;
  }
}
