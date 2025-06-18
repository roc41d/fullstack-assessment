import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../interface/todo.interface';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent],
  template: `
    <div class="divide-y divide-border-color">
      <app-todo-item
        *ngFor="let todo of todos; trackBy: trackById"
        [todo]="todo"
        (toggleComplete)="toggleComplete.emit($event)"
        (deleteTodo)="deleteTodo.emit($event)"
      ></app-todo-item>
    </div>
  `
})
export class TodoListComponent {
  @Input() todos: Todo[] | null = [];
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() deleteTodo = new EventEmitter<number>();

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}