import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-text-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-text-input.component.html',
  styleUrls: ['./custom-text-input.component.scss']
})
export class CustomTextInputComponent {
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() type: string = 'text';
  @Input() inputStyle: any = {};
  @Output() valueChange = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }

  // For two-way binding
  updateValue(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}

