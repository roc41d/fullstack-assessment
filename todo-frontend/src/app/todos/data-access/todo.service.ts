import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../interface/todo.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
//   private apiUrl = 'localhost:3000/api/todos/api/todos'; 
//   private apiUrl = environment.apiUrl;
private apiUrl = `${environment.apiUrl}/todos`;

  private _todos = new BehaviorSubject<Todo[]>([]);
  public readonly todos$: Observable<Todo[]> = this._todos.asObservable();

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  /**
   * Fetches all todos from the backend API.
   * Updates the BehaviorSubject with the fetched data.
   */
  private loadTodos(): void {
    this.http.get<{ status: string, data: Todo[] }>(this.apiUrl)
      .pipe(
        tap(response => {
          // Map completed: 0/1 from backend to boolean for internal consistency (optional, but good practice)
          const todos = response.data.map(todo => ({
            ...todo,
            completed: todo.completed === 1 ? true : false
          }));
          this._todos.next(todos);
        }),
        catchError(this.handleError('loadTodos', []))
      )
      .subscribe();
  }

  /**
   * Adds a new todo to the backend API.
   * Updates the BehaviorSubject with the new todo returned from the API.
   * @param title The title of the new todo.
   */
  addTodo(title: string): void {
    const payload = { title: title.trim(), completed: 0 }; // Send 0 for not completed

    this.http.post<{ status: string, data: Todo }>(this.apiUrl, payload)
      .pipe(
        tap(response => {
          const currentTodos = this._todos.getValue();
          // Map completed: 0/1 from backend to boolean
          const newTodo = { ...response.data, completed: response.data.completed === 1 ? true : false };
          this._todos.next([...currentTodos, newTodo]);
        }),
        catchError(this.handleError('addTodo'))
      )
      .subscribe();
  }

  /**
   * Toggles the completion status of a todo on the backend API.
   * Updates the BehaviorSubject with the updated todo returned from the API.
   * @param id The ID of the todo to toggle.
   */
  toggleComplete(id: number): void {
    const currentTodo = this._todos.getValue().find(todo => todo.id === id);
    if (!currentTodo) {
      console.error('Todo not found for toggling completion:', id);
      return;
    }

    // Backend endpoint uses just /:id/complete, and it seems to toggle internally.
    this.http.put<{ status: string, data: Todo }>(`${this.apiUrl}/${id}/complete`, {})
      .pipe(
        tap(response => {
          const currentTodos = this._todos.getValue();
          // Map completed: 0/1 from backend to boolean
          const updatedTodo = { ...response.data, completed: response.data.completed === 1 ? true : false };
          this._todos.next(currentTodos.map(todo =>
            todo.id === id ? updatedTodo : todo
          ));
        }),
        catchError(this.handleError('toggleComplete'))
      )
      .subscribe();
  }

  /**
   * Deletes a todo from the backend API.
   * Updates the BehaviorSubject by removing the deleted todo.
   * @param id The ID of the todo to delete.
   */
  deleteTodo(id: number): void {
    this.http.delete<{ status: string, data: { message: string } }>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentTodos = this._todos.getValue();
          this._todos.next(currentTodos.filter(todo => todo.id !== id));
        }),
        catchError(this.handleError('deleteTodo'))
      )
      .subscribe();
  }

  /**
   * Clears all completed todos from the backend API.
   * Updates the BehaviorSubject by filtering out completed todos.
   */
  clearCompleted(): void {
    this.http.delete<{ status: string, data: { message: string } }>(`${this.apiUrl}/completed`)
      .pipe(
        tap(() => {
          const currentTodos = this._todos.getValue();
          this._todos.next(currentTodos.filter(todo => !todo.completed));
        }),
        catchError(this.handleError('clearCompleted'))
      )
      .subscribe();
  }

  /**
   * Generic error handling for HTTP requests.
   * @param operation Name of the failed operation.
   * @param result Optional value to return as the observable result.
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Re-throw the error to be handled by the component or another error interceptor.
      return throwError(() => new Error(`Error: ${error.message || error}`));
    };
  }
}