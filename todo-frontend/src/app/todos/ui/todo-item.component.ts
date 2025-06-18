import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Todo } from '../interface/todo.interface';

@Component({
  selector: 'app-todo-item',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for ngIf
  template: `
    <div class="checkbox-custom mr-4" [class.completed]="todo.completed" (click)="toggleComplete.emit(todo.id)">
      <ng-container *ngIf="todo.completed">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
          <path fill="none" stroke="#FFF" stroke-width="2" d="M1 4.304L3.696 7l6-6"/>
        </svg>
      </ng-container>
    </div>
    <p class="todo-text flex-grow text-sm sm:text-base" [class.completed]="todo.completed">
      {{ todo.title }}
    </p>
    <button class="delete-btn" (click)="deleteTodo.emit(todo.id)">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.82l7.132 7.132-.707.707L8.82 9.546 1.688 16.678l-.707-.707L8.113 8.82 1 .707 1.707 0 8.82 7.113 15.933 0z"/>
      </svg>
    </button>
  `,
  host: {
    'class': 'todo-item flex items-center p-4 gap-4',
    '[class.completed]': 'todo.completed',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() deleteTodo = new EventEmitter<number>();
}