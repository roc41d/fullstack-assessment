export interface Todo {
  id: number;
  title: string;
  completed: number | boolean; // 0/1 from backend, but can be treated as boolean in frontend
  created_at?: string;
  updated_at?: string;
}
