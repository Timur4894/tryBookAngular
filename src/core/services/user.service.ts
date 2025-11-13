import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  profile_picture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users';
  private fakeProfile: UserProfile = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    profile_picture: 'https://via.placeholder.com/150?text=User'
  };

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    // Фейковые данные
    return of({ ...this.fakeProfile }).pipe(delay(300));
  }

  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    // Фейковые данные
    this.fakeProfile = { ...this.fakeProfile, ...profile };
    return of({ ...this.fakeProfile }).pipe(delay(300));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    // Фейковые данные
    return of(undefined).pipe(delay(300));
  }

  // Administrator only
  getUsers(): Observable<UserProfile[]> {
    // Фейковые данные
    const fakeUsers: UserProfile[] = [
      { id: 1, email: 'user1@example.com', name: 'User 1' },
      { id: 2, email: 'user2@example.com', name: 'User 2' },
      { id: 3, email: 'user3@example.com', name: 'User 3' }
    ];
    return of(fakeUsers).pipe(delay(300));
  }

  updateUserRole(userId: number, roleId: number): Observable<void> {
    // Фейковые данные
    return of(undefined).pipe(delay(300));
  }
}

