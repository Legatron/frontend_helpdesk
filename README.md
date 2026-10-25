# HelpDesk (AHJ — Домашнее задание «Работа с HTTP»)

[![Build](https://github.com/Legatron/frontend_helpdesk/actions/workflows/web.yml/badge.svg)](https://github.com/Legatron/frontend_helpdesk/actions/workflows/web.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen)](https://legatron.github.io/frontend_helpdesk/)

🔗 **Демо:** https://legatron.github.io/frontend_helpdesk/

## О проекте

Фронтенд для системы управления заявками (HelpDesk). Реализован на чистом JavaScript, собирается через Webpack.

Функционал:
- Отображение всех тикетов (загружаются с сервера)
- Просмотр деталей тикета (по клику на тело)
- Создание нового тикета
- Редактирование существующего тикета
- Удаление тикета с подтверждением
- Отметка о выполнении

## Запуск локально

```bash
# Установка зависимостей
npm ci

# Dev-сервер на http://localhost:8080
npm start

# Продакшен-сборка в папку dist/
npm run build

# Линтинг
npm run lint
