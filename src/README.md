# TryBook - Angular Application

This project rewrites the original TryBook React Native app using Angular standalone components.

## Project structure

```
src/
├── app.component.ts          # Root component
├── app.config.ts              # Application providers (router, HTTP)
├── app.routes.ts              # Route definitions
├── main.ts                    # Bootstrap entry
├── core/
│   ├── guards/
│   │   └── auth.guard.ts      # Route guard
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Attaches auth token
│   └── services/
│       ├── auth.service.ts    # Authentication API
│       ├── book.service.ts    # Books API
│       ├── library.service.ts # Library / reading history API
│       └── user.service.ts    # Profile API
├── auth/
│   └── components/
│       ├── login/
│       ├── register/
│       └── forgot-password/
├── books/
│   └── components/
│       ├── explore-books/
│       ├── book-detail/
│       └── book-content/
├── library/
│   └── components/
│       └── my-library/
├── profile/
│   └── components/
│       ├── profile/
│       ├── edit-profile/
│       └── subscription/
├── shared/
│   └── components/
│       ├── custom-button/
│       ├── custom-text-input/
│       └── custom-modal/
└── theme/
    └── colors.ts              # Color palette
```

## Key differences from the React Native app

1. **Components**: All screens were converted to Angular standalone components.
2. **Navigation**: React Navigation was replaced by Angular Router.
3. **State management**: Redux Toolkit was replaced by lightweight services with RxJS.
4. **Styling**: StyleSheet files were migrated to SCSS modules.
5. **HTTP**: Axios/fetch calls were replaced with Angular HttpClient.
6. **Forms**: React Native forms were replaced with Angular FormsModule.

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
ng serve

# Production build
ng build
```

## API endpoints

The services expect a REST API mounted at `/api/*`:
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/forgot-password`
- `/api/books`
- `/api/books/:id`
- `/api/library`
- `/api/users/profile`

## Guards

- `AuthGuard` protects routes that require authentication.

## Interceptors

- `AuthInterceptor` automatically injects the bearer token into HTTP requests.

