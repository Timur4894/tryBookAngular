import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent {
  @Input() visible: boolean = false;
  @Input() title: string = '';
  @Input() mainText: string = '';
  @Output() onClose = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }
}

