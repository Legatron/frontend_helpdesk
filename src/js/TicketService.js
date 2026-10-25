/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */

import createRequest from './api/createRequest';

const BASE_URL = 'https://backend-helpdesk-q2ru.onrender.com'; // укажите ваш адрес бэкенда

export default class TicketService {
  async list() {
    return createRequest({
      url: `${BASE_URL}/?method=allTickets`,
    });
  }

  async get(id) {
    return createRequest({
      url: `${BASE_URL}/?method=ticketById&id=${id}`,
    });
  }

  async create(data) {
    return createRequest({
      url: `${BASE_URL}/?method=createTicket`,
      method: 'POST',
      body: data,
    });
  }

  async update(id, data) {
    return createRequest({
      url: `${BASE_URL}/?method=updateById&id=${id}`,
      method: 'POST',
      body: data,
    });
  }

  async delete(id) {
    return createRequest({
      url: `${BASE_URL}/?method=deleteById&id=${id}`,
      method: 'GET',
    });
  }
}
