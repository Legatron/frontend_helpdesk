import TicketView from './TicketView';
import TicketForm from './TicketForm';

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container, ticketService) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = ticketService;

    // Состояние приложения
    this.tickets = [];
    this.expandedTicketId = null; // ID тикета, который сейчас раскрыт

    // Ссылки на DOM-элементы
    this.listEl = null;
    this.addBtn = null;
  }

  init() {
    console.info('HelpDesk init');
    this._initUI();
    this._bindEvents();
    this._loadTickets();
  }

  _initUI() {
    this.container.innerHTML = `
      <div class="helpdesk">
        <div class="helpdesk__toolbar">
          <button class="helpdesk__add-btn">Добавить тикет</button>
        </div>
        <div class="helpdesk__list"></div>
      </div>
    `;
    this.listEl = this.container.querySelector('.helpdesk__list');
    this.addBtn = this.container.querySelector('.helpdesk__add-btn');
  }

  _bindEvents() {
    // Обработка кнопки "Добавить тикет"
    this.addBtn.addEventListener('click', () => this._showCreateForm());

    // Делегирование событий для списка тикетов
    this.listEl.addEventListener('click', async (e) => {
      const ticketEl = e.target.closest('.ticket');
      if (!ticketEl) return;
      const { id } = ticketEl.dataset;

      // Клик по кнопке "Редактировать"
      if (e.target.dataset.action === 'edit') {
        e.stopPropagation();
        await this._showEditForm(id);
        return;
      }

      // Клик по кнопке "Удалить"
      if (e.target.dataset.action === 'delete') {
        e.stopPropagation();
        this._showDeleteConfirm(id);
        return;
      }

      // Клик по чекбоксу (статус)
      if (e.target.dataset.action === 'toggle') {
        e.stopPropagation();
        await this._toggleStatus(id);
        return;
      }

      // Клик по телу тикета (кроме кнопок) — раскрыть/скрыть детали
      if (!e.target.closest('button') && !e.target.closest('.ticket__status')) {
        await this._toggleDetails(id);
      }
    });
  }

  async _loadTickets() {
    try {
      this.listEl.innerHTML = '<div class="loading">Загрузка...</div>';
      this.tickets = await this.ticketService.list();
      this._renderList();
    } catch (err) {
      console.error('Ошибка загрузки тикетов:', err);
      this.listEl.innerHTML = '<div class="error">Не удалось загрузить тикеты</div>';
    }
  }

  _renderList() {
    if (this.tickets.length === 0) {
      this.listEl.innerHTML = '<div class="empty">Нет тикетов</div>';
      return;
    }

    this.listEl.innerHTML = this.tickets
      .map((ticket) => {
        const isExpanded = this.expandedTicketId === ticket.id;
        return TicketView.render(ticket, !isExpanded);
      })
      .join('');
  }

  async _toggleDetails(id) {
    // Если тикет уже раскрыт - скрываем
    if (this.expandedTicketId === id) {
      this.expandedTicketId = null;
      this._renderList();
      return;
    }

    // Загружаем полные данные тикета (с описанием)
    try {
      const fullTicket = await this.ticketService.get(id);

      // Обновляем локальный кеш
      const index = this.tickets.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.tickets[index] = { ...this.tickets[index], ...fullTicket };
      }

      this.expandedTicketId = id;
      this._renderList();
    } catch (err) {
      console.error('Ошибка загрузки деталей тикета:', err);
    }
  }

  async _toggleStatus(id) {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) return;

    const updated = { ...ticket, status: !ticket.status };

    try {
      await this.ticketService.update(id, updated);

      const index = this.tickets.findIndex((t) => t.id === id);
      this.tickets[index] = updated;

      // Перерисовываем список
      this._renderList();
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  }

  _showCreateForm() {
    const form = new TicketForm({
      title: 'Добавить тикет',
      onSubmit: async (data) => {
        try {
          await this.ticketService.create({ ...data, status: false });
          await this._loadTickets(); // Перезагружаем список с сервера
        } catch (err) {
          console.error('Ошибка создания тикета:', err);
        }
      },
    });
    form.open();
  }

  async _showEditForm(id) {
    let ticket = this.tickets.find((t) => t.id === id);

    // Если в кеше нет описания, подгружаем полный тикет
    if (!ticket.description) {
      try {
        ticket = await this.ticketService.get(id);
        const index = this.tickets.findIndex((t) => t.id === id);
        if (index !== -1) this.tickets[index] = ticket;
      } catch (err) {
        console.error('Ошибка загрузки тикета для редактирования:', err);
        return;
      }
    }

    const form = new TicketForm({
      title: 'Изменить тикет',
      name: ticket.name,
      description: ticket.description || '',
      onSubmit: async (data) => {
        try {
          await this.ticketService.update(id, { ...ticket, ...data });
          await this._loadTickets();
        } catch (err) {
          console.error('Ошибка редактирования тикета:', err);
        }
      },
    });
    form.open();
  }

  _showDeleteConfirm(id) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal__content">
        <h2 class="modal__title">Удалить тикет</h2>
        <p>Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
        <div class="modal__actions">
          <button class="modal__cancel">Отмена</button>
          <button class="modal__submit">Ok</button>
        </div>
      </div>
    `;

    const cancelBtn = modal.querySelector('.modal__cancel');
    const submitBtn = modal.querySelector('.modal__submit');

    cancelBtn.addEventListener('click', () => modal.remove());

    submitBtn.addEventListener('click', async () => {
      try {
        await this.ticketService.delete(id);
        await this._loadTickets();
        modal.remove();
      } catch (err) {
        console.error('Ошибка удаления тикета:', err);
      }
    });

    document.body.appendChild(modal);
  }
}
