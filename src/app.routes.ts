import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'books',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./books/components/explore-books/explore-books.component').then(m => m.ExploreBooksComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./books/components/book-detail/book-detail.component').then(m => m.BookDetailComponent)
      },
      {
        path: ':id/read',
        loadComponent: () => import('./books/components/book-content/book-content.component').then(m => m.BookContentComponent)
      }
    ]
  },
  {
    path: 'library',
    canActivate: [AuthGuard],
    loadComponent: () => import('./library/components/my-library/my-library.component').then(m => m.MyLibraryComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./profile/components/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'edit',
        loadComponent: () => import('./profile/components/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./profile/components/subscription/subscription.component').then(m => m.SubscriptionComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/books',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/books'
  }
];

