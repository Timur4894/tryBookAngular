import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  name?: string;
  fullname?: string;
  roles?: string[];
  role?: string;
  subscription?: any;
  profile_picture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface LoginResponse {
  token?: string;
  access_token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
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
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        this.authStateSubject.next({
          user: JSON.parse(userStr),
          isAuthenticated: true,
          token
        });
      } else if (token && !userStr) {
        this.authStateSubject.next({
          user: null,
          isAuthenticated: true,
          token
        });
        this.refreshCurrentUser().subscribe();
      }
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      switchMap(response => this.handleAuthSuccess(response))
    );
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email,
      password,
      fullname: name
    });
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
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  refreshCurrentUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      map(response => {
        // Extract user from response if wrapped in {success, user}
        const userData = response.user || response;
        return this.normalizeUser(userData);
      }),
      tap(user => this.persistState(token, user)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  updateStoredUser(partial: Partial<User>): void {
    const currentState = this.authStateSubject.value;
    if (!currentState.isAuthenticated || !currentState.token || !currentState.user) {
      return;
    }

    const updatedUser = this.normalizeUser({
      ...currentState.user,
      ...partial
    });

    this.persistState(currentState.token, updatedUser);
  }

  private handleAuthSuccess(response: LoginResponse): Observable<User> {
    const token = this.extractToken(response);

    if (!token) {
      return throwError(() => new Error('Authentication token is missing in the response'));
    }

    if (response.user) {
      const normalizedUser = this.normalizeUser(response.user);
      this.persistState(token, normalizedUser);
      return of(normalizedUser);
    }

    return this.fetchCurrentUserWithToken(token);
  }

  private fetchCurrentUserWithToken(token: string): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      map(response => {
        // Extract user from response if wrapped in {success, user}
        const userData = response.user || response;
        return this.normalizeUser(userData);
      }),
      tap(user => this.persistState(token, user)),
      catchError((error) => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  private extractToken(response: LoginResponse): string | undefined {
    return response.token || response.access_token;
  }

  private persistState(token: string, user: User | null): void {
    const authState: AuthState = {
      user,
      isAuthenticated: !!token && !!user,
      token
    };

    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }

    this.authStateSubject.next(authState);
  }

  private normalizeUser(user: any): User {
    if (!user) {
      return {
        id: 0,
        email: '',
        name: ''
      };
    }

    // Handle subscription - can be Subscription object or subscription_id
    const subscription = user.Subscription || user.subscription || 
                        (user.subscription_id ? { id: user.subscription_id } : null);

    return {
      id: user.id,
      email: user.email || '',
      name: user.name || user.fullname || user.fullName || '',
      fullname: user.fullname || user.fullName || user.name,
      roles: user.roles || (user.role ? [user.role] : undefined) || (user.is_admin ? ['admin'] : ['user']),
      role: user.role || (user.is_admin ? 'admin' : 'user'),
      subscription: subscription,
      profile_picture: user.profile_picture || user.avatar_url || user.avatar
    };
  }
}

