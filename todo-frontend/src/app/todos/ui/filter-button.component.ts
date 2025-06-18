import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="filter-btn"
      [class.active]="currentFilter === filter"
      (click)="setFilter.emit(filter)"
      [attr.data-filter]="filter"
    >
      {{ text }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterButtonComponent {
  @Input() filter: string = '';
  @Input() currentFilter: string | null = 'all';
  @Input() text: string = '';
  @Output() setFilter = new EventEmitter<string>();
}