import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-todo-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card p-4 flex items-center rounded-lg mb-6">
      <div class="checkbox-custom mr-4"></div>
      <input
        type="text"
        class="input-field w-full py-2 bg-transparent focus:outline-none text-sm sm:text-base"
        placeholder="Create a new todo..."
        [(ngModel)]="inputValue"
        (keydown.enter)="handleAddTodo()"
      />
    </div>
  `
})
export class TodoInputComponent {
  inputValue: string = '';
  @Output() addTodo = new EventEmitter<string>();

  handleAddTodo(): void {
    if (this.inputValue.trim()) {
      this.addTodo.emit(this.inputValue);
      this.inputValue = '';
    }
  }
}