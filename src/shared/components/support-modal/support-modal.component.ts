import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomTextInputComponent } from '../custom-text-input/custom-text-input.component';

@Component({
  selector: 'app-support-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomButtonComponent, CustomTextInputComponent],
  templateUrl: './support-modal.component.html',
  styleUrls: ['./support-modal.component.scss']
})
export class SupportModalComponent {
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{ subject: string; description: string }>();

  subject: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  close(): void {
    this.resetForm();
    this.onClose.emit();
  }

  handleSubmit(): void {
    if (!this.subject.trim() || !this.description.trim()) {
      return;
    }

    this.isSubmitting = true;
    this.onSubmit.emit({
      subject: this.subject.trim(),
      description: this.description.trim()
    });

    // Reset form after a short delay
    setTimeout(() => {
      this.resetForm();
      this.isSubmitting = false;
    }, 500);
  }

  private resetForm(): void {
    this.subject = '';
    this.description = '';
    this.isSubmitting = false;
  }
}

