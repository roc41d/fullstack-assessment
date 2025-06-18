import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterButtonComponent } from './filter-button.component';

@Component({
  selector: 'app-todo-footer',
  standalone: true,
  imports: [CommonModule, FilterButtonComponent],
  template: `
    <div class="flex justify-between items-center p-4 text-xs sm:text-sm footer-text">
      <span id="items-left">{{ activeTodoCount }} items left</span>
      <div class="hidden sm:flex space-x-4">
        <app-filter-button [filter]="'all'" [currentFilter]="currentFilter" (setFilter)="setFilter.emit($event)" [text]="'All'"></app-filter-button>
        <app-filter-button [filter]="'active'" [currentFilter]="currentFilter" (setFilter)="setFilter.emit($event)" [text]="'Active'"></app-filter-button>
        <app-filter-button [filter]="'completed'" [currentFilter]="currentFilter" (setFilter)="setFilter.emit($event)" [text]="'Completed'"></app-filter-button>
      </div>
      <button class="filter-btn" (click)="clearCompleted.emit()">Clear Completed</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoFooterComponent {
  @Input() activeTodoCount: number | null = 0;
  @Input() currentFilter: string | null = 'all';
  @Output() setFilter = new EventEmitter<string>();
  @Output() clearCompleted = new EventEmitter<void>();
}