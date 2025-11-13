import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load token from localStorage on init (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        this.authStateSubject.next({
          user: JSON.parse(userStr),
          isAuthenticated: true,
          token: token
        });
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    // Фейковые данные
    const fakeResponse = {
      user: {
        id: 1,
        email: email,
        name: 'Test User',
        roles: ['user']
      },
      token: 'fake-jwt-token-' + Date.now()
    };

    return of(fakeResponse).pipe(
      delay(500), // Имитация задержки сети
      tap((response: any) => {
        const state: AuthState = {
          user: response.user,
          isAuthenticated: true,
          token: response.token
        };
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        this.authStateSubject.next(state);
      })
    );
  }

  register(email: string, password: string, name: string): Observable<any> {
    // Фейковые данные
    const fakeResponse = {
      message: 'User registered successfully',
      user: {
        id: Date.now(),
        email: email,
        name: name,
        roles: ['user']
      }
    };
    return of(fakeResponse).pipe(delay(500));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.authStateSubject.next({
      user: null,
      isAuthenticated: false,
      token: null
    });
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  forgotPassword(email: string): Observable<any> {
    // Фейковые данные
    const fakeResponse = {
      message: 'Password reset email sent successfully'
    };
    return of(fakeResponse).pipe(delay(500));
  }
}

