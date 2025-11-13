import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  profilePicture: string = '/assets/img/TestBook.jpg';

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.name = profile.name;
        this.email = profile.email;
        this.profilePicture = profile.profile_picture || '/assets/img/TestBook.jpg';
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  handleChangePhoto(): void {
    // In a real app, this would open a file picker
    console.log('Change photo clicked');
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

