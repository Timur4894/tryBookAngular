import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, UserProfile } from '../../../core/services/user.service';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTextInputComponent, CustomButtonComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  name: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // Try to get from AuthService first (cached data)
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.name = currentUser.name || currentUser.fullname || '';
      this.email = currentUser.email || '';
    }

    // Then fetch fresh data from API
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.name = profile.name || '';
        this.email = profile.email || '';
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        // Keep the cached data if API call fails
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  handleSave(): void {
    this.userService.updateProfile({
      name: this.name,
      email: this.email
    }).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
      }
    });
  }
}

