import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';
import colors from '../../../theme/colors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomButtonComponent, CustomTextInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  colors = colors;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    console.log('onLogin called', { email: this.email, password: this.password });
    
    // Для тестирования разрешаем логин даже с пустыми полями
    if (!this.email) {
      this.email = 'test@example.com';
    }
    if (!this.password) {
      this.password = 'test';
    }

    this.isLoading = true;
    this.error = '';

    console.log('Calling authService.login...');
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.isLoading = false;
        this.router.navigate(['/books']).then(() => {
          console.log('Navigation completed');
        }).catch((err) => {
          console.error('Navigation error', err);
        });
      },
      error: (err) => {
        console.error('Login error', err);
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}

