# TryBook - Angular Application

Это переписанная версия React Native приложения TryBook на Angular.

## Структура проекта

```
src-angular/
├── app.component.ts          # Главный компонент приложения
├── app.config.ts              # Конфигурация приложения (роутинг, HTTP)
├── app.routes.ts              # Определение маршрутов
├── main.ts                    # Точка входа
├── core/                      # Основные сервисы и guards
│   ├── guards/
│   │   └── auth.guard.ts      # Guard для защиты маршрутов
│   ├── interceptors/
│   │   └── auth.interceptor.ts # HTTP interceptor для добавления токена
│   └── services/
│       ├── auth.service.ts    # Сервис авторизации
│       ├── book.service.ts    # Сервис для работы с книгами
│       ├── library.service.ts # Сервис для работы с библиотекой
│       └── user.service.ts    # Сервис для работы с пользователями
├── auth/                      # Модуль авторизации
│   └── components/
│       ├── login/
│       ├── register/
│       └── forgot-password/
├── books/                     # Модуль книг
│   └── components/
│       ├── explore-books/
│       ├── book-detail/
│       └── book-content/
├── library/                   # Модуль библиотеки
│   └── components/
│       └── my-library/
├── profile/                   # Модуль профиля
│   └── components/
│       ├── profile/
│       ├── edit-profile/
│       └── subscription/
├── shared/                    # Общие компоненты
│   └── components/
│       ├── custom-button/
│       ├── custom-text-input/
│       └── custom-modal/
└── theme/
    └── colors.ts              # Цветовая палитра
```

## Основные изменения от React Native

1. **Компоненты**: Все React Native компоненты переписаны на Angular standalone компоненты
2. **Навигация**: React Navigation заменен на Angular Router
3. **State Management**: Redux Toolkit заменен на Angular Services с RxJS
4. **Стили**: React Native StyleSheet заменен на SCSS файлы
5. **HTTP**: Используется Angular HttpClient вместо fetch/axios
6. **Формы**: Используется Angular FormsModule для работы с формами

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
ng serve

# Сборка для production
ng build
```

## API Endpoints

Все сервисы ожидают REST API на `/api/*`:
- `/api/auth/login` - авторизация
- `/api/auth/register` - регистрация
- `/api/auth/forgot-password` - восстановление пароля
- `/api/books` - список книг
- `/api/books/:id` - детали книги
- `/api/library` - библиотека пользователя
- `/api/users/profile` - профиль пользователя

## Guards

- `AuthGuard` - защищает маршруты, требующие авторизации

## Interceptors

- `AuthInterceptor` - автоматически добавляет токен авторизации к HTTP запросам

