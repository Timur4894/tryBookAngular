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
  isSupportModalVisible: boolean = false;
  notificationsEnabled: boolean = true;
  themeEnabled: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  navigateToEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  handleOpenModal(): void {
    this.isModalVisible = true;
  }

  handleOpenSupportModal(): void {
    this.isSupportModalVisible = true;
  }

  handleCloseModal(): void {
    this.isModalVisible = false;
    this.isSupportModalVisible = false;
  }

  navigateToSubscription(): void {
    this.router.navigate(['/profile/subscription']);
  }

  openPrivacyPolicy(): void {
    window.open('https://www.google.com', '_blank');
  }

  openSupportEmail(): void {
    const email = 'support@trybook.com';
    const subject = 'Support Request';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

