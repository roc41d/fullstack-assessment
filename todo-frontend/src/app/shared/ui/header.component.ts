import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-white text-3xl sm:text-4xl font-bold tracking-widest uppercase">TODO</h1>
      <button (click)="toggleTheme.emit()" class="focus:outline-none">
        <span id="theme-icon">
          <ng-container *ngIf="theme === 'light'; else darkThemeIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
              <path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c5.071 0 9.204-3.693 10.185-8.812a9.025 9.025 0 01-2.373.216c-5.385 0-9.75-4.365-9.75-9.75S13 0 13 0z"/>
            </svg>
          </ng-container>
          <ng-template #darkThemeIcon>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
              <path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.121-2.121a1 1 0 011.414 0zm11.314 0a1 1 0 010 1.414l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.121a1 1 0 01-1.414 0zM21 13a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zM4 13a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zM12 2a1 1 0 011 1v3a1 1 0 11-2 0V3a1 1 0 011-1zm-5.657 2.343a1 1 0 011.414 0L9.828 6.828a1 1 0 01-1.414 1.414L5.657 5.657a1 1 0 010-1.414zm11.314 0a1 1 0 011.414 0L18.343 5.657a1 1 0 01-1.414 1.414l-2.121-2.121a1 1 0 010-1.414zM13 13a5 5 0 110-10 5 5 0 010 10z" clip-rule="evenodd"/>
            </svg>
          </ng-template>
        </span>
      </button>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() theme: string | null = 'light';
  @Output() toggleTheme = new EventEmitter<void>();
}