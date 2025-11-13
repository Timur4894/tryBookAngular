import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  @Input() title: string = '';
  @Input() buttonStyle: any = {};
  @Input() titleStyle: any = {};
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    console.log('CustomButton onClick called');
    this.buttonClick.emit();
    console.log('CustomButton event emitted');
  }
}

