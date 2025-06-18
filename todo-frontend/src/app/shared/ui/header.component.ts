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
            <img src="assets/images/icon-moon.svg"  width="26" height="26" alt="Icon">
          </ng-container>
          <ng-template #darkThemeIcon>
            <img src="assets/images/icon-sun.svg"  width="26" height="26" alt="Icon">
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