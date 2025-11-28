import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomTextInputComponent } from '../../../shared/components/custom-text-input/custom-text-input.component';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTextInputComponent, CustomButtonComponent],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
  subject: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  handleSubmit(): void {
    if (!this.subject.trim() || !this.description.trim()) {
      return;
    }

    this.isSubmitting = true;

    // In a real app, this would send the support request to the backend
    console.log('Support request:', {
      subject: this.subject.trim(),
      description: this.description.trim()
    });

    // For now, we can also open email client as fallback
    const email = 'support@trybook.com';
    const subject = encodeURIComponent(this.subject.trim());
    const body = encodeURIComponent(this.description.trim());
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    // Reset form after a short delay
    setTimeout(() => {
      this.resetForm();
      this.isSubmitting = false;
    }, 1000);
  }

  private resetForm(): void {
    this.subject = '';
    this.description = '';
    this.isSubmitting = false;
  }
}

