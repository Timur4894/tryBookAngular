import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';
import { CustomModalComponent } from '../../../shared/components/custom-modal/custom-modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomButtonComponent, CustomTextInputComponent, CustomModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  isModalVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/books']);
    }
  }

  onResetPassword(): void {
    if (!this.email) {
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isModalVisible = true;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isModalVisible = true;
      }
    });
  }

  handleCloseModal(): void {
    this.isModalVisible = false;
    this.router.navigate(['/auth/login']);
  }
}

