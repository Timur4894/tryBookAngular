import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, UserProfile } from '../../../core/services/user.service';
import { CustomModalComponent } from '../../../shared/components/custom-modal/custom-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  isModalVisible: boolean = false;

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
      this.profile = {
        id: currentUser.id,
        email: currentUser.email || '',
        name: currentUser.name || currentUser.fullname || '',
        fullname: currentUser.fullname || currentUser.name,
        profile_picture: currentUser.profile_picture,
        role: currentUser.role,
        subscription: currentUser.subscription
      };
    }

    // Then fetch fresh data from API
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        // Keep the cached data if API call fails
      }
    });
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  handleOpenModal(): void {
    this.isModalVisible = true;
  }

  handleCloseModal(): void {
    this.isModalVisible = false;
  }

  navigateToSubscription(): void {
    this.router.navigate(['/profile/subscription']);
  }

  openPrivacyPolicy(): void {
    this.router.navigate(['/profile/privacy-policy']);
  }

  openSupportEmail(): void {
    this.router.navigate(['/profile/support']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

