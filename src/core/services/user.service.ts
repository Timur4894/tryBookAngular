import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  fullname?: string;
  profile_picture?: string;
  role?: string;
  subscription?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersApiUrl = `${environment.apiUrl}/api/users`;
  private currentUserUrl = `${environment.apiUrl}/api/auth/me`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<any>(this.currentUserUrl).pipe(
      map(response => {
        // Extract user from response if wrapped in {success, user}
        const userData = response.user || response;
        return this.normalizeProfile(userData);
      }),
      tap(profile => this.authService.updateStoredUser(profile))
    );
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<any>(`${this.usersApiUrl}/profile`, profile).pipe(
      map(response => {
        // Extract user from response if wrapped
        const userData = response.user || response;
        return this.normalizeProfile(userData);
      }),
      tap(updated => this.authService.updateStoredUser(updated))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.usersApiUrl}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  getUsers(): Observable<UserProfile[]> {
    return this.http.get<any[]>(this.usersApiUrl).pipe(
      map(users => users.map(user => this.normalizeProfile(user)))
    );
  }

  updateUserRole(userId: number, roleId: number): Observable<void> {
    return this.http.put<void>(`${this.usersApiUrl}/${userId}/role`, {
      role_id: roleId
    });
  }

  private normalizeProfile(profile: any): UserProfile {
    if (!profile) {
      return {
        id: 0,
        email: '',
        name: ''
      };
    }

    // Handle subscription - can be Subscription object or subscription_id
    const subscription = profile.Subscription || profile.subscription || 
                        (profile.subscription_id ? { id: profile.subscription_id } : null);

    return {
      id: profile.id,
      email: profile.email || '',
      name: profile.name || profile.fullname || profile.fullName || '',
      fullname: profile.fullname || profile.fullName || profile.name,
      profile_picture: profile.profile_picture || profile.avatar_url || profile.avatar,
      role: profile.role || (profile.is_admin ? 'admin' : 'user'),
      subscription: subscription
    };
  }
}

