export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateTodoDto = Pick<Todo, 'title'> & Partial<Pick<Todo, 'completed'>>;