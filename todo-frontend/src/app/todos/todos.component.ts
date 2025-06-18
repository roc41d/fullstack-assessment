import { HeaderComponent } from '../shared/ui/header.component';
import { Component, OnInit, HostBinding, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoService } from './data-access/todo.service';
import { Todo } from './interface/todo.interface';
import { TodoInputComponent } from './ui/todo-input.component';
import { TodoListComponent } from './ui/todo-list.component';
import { TodoFooterComponent } from './ui/todo-footer.component';
import { FilterButtonComponent } from './ui/filter-button.component';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TodoInputComponent,
    TodoListComponent,
    TodoFooterComponent,
    FilterButtonComponent,
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  // Theme management
  private _theme = new BehaviorSubject<string>(
    localStorage.getItem('theme') || 'light'
  );
  public theme$: Observable<string> = this._theme.asObservable();
  @HostBinding('class') get themeClass() {
    return this._theme.getValue();
  }

  // Filter management
  private _currentFilter = new BehaviorSubject<string>('all');
  public currentFilter$: Observable<string> =
    this._currentFilter.asObservable();

  // Todos filtered by current filter
  public filteredTodos$!: Observable<Todo[]>;
  public activeTodoCount$!: Observable<number>;

  constructor(private todoService: TodoService, private renderer: Renderer2) {}

  ngOnInit() {
    // Combine todos and filter to get filteredTodos$
    this.filteredTodos$ = combineLatest([
      this.todoService.todos$,
      this.currentFilter$,
    ]).pipe(
      map(([todos, filter]) => {
        if (filter === 'active') return todos.filter((todo) => !todo.completed);
        if (filter === 'completed')
          return todos.filter((todo) => todo.completed);
        return todos;
      })
    );

    // Calculate active todo count
    this.activeTodoCount$ = this.todoService.todos$.pipe(
      map((todos) => todos.filter((todo) => !todo.completed).length)
    );

    // Initial background update (would be handled in a more robust way in a real app, e.g., a dedicated service)
    this.updateBackground();
    window.addEventListener('resize', () => this.updateBackground());
  }

  // toggleTheme(): void {
  //   const newTheme = this._theme.getValue() === 'light' ? 'dark' : 'light';
  //   this._theme.next(newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   this.updateBackground();
  // }

  toggleTheme(): void {
    const currentTheme = this._theme.getValue();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Remove old theme class and add new one to body
    this.renderer.removeClass(document.body, currentTheme);
    this.renderer.addClass(document.body, newTheme);

    this._theme.next(newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateBackground();
  }

  addTodo(title: string): void {
    this.todoService.addTodo(title);
  }

  toggleComplete(id: number): void {
    this.todoService.toggleComplete(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }

  setFilter(filter: string): void {
    this._currentFilter.next(filter);
  }

  // Helper to update background based on theme and screen size (simplified for illustration)
  private updateBackground(): void {
    const bgElement = document.getElementById('theme-background');
    console.log('Updating background for theme:', bgElement);

    if (!bgElement) return;

    const currentTheme = this._theme.getValue();
    let imageUrl: string;

    if (currentTheme === 'light') {
      if (window.innerWidth < 768) {
        bgElement.className = 'theme-background bg-image-mobile-light';
    } else {
        bgElement.className = 'theme-background bg-image-desktop-light';
    }
} else {
    if (window.innerWidth < 768) {
        bgElement.className = 'theme-background bg-image-mobile-dark';
    } else {
        bgElement.className = 'theme-background bg-image-desktop-dark';
    }
    }
  }
}
