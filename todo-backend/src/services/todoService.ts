import db from '../database/db';
import { Todo } from '../types/todo';

export const getAllTodos = (): Todo[] => {
    try {
      return db.prepare('SELECT * FROM todos').all() as Todo[];
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${getErrorMessage(error)}`);
    }
  };

  export const getTodoById = (id: number): Todo | null => {
    try {
      const row = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
      return row as Todo ?? null;
    } catch (error) {
      throw new Error(`Failed to fetch todo ${id}: ${getErrorMessage(error)}`);
    }
  };

export const createTodo = (title: string): Todo => {
  try {
    const stmt = db.prepare(`
      INSERT INTO todos (title, completed, created_at, updated_at)
      VALUES (?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);
    const result = stmt.run(title);
    return getTodoById(result.lastInsertRowid as number)!;
  } catch (error) {
    throw new Error(`Failed to create todo: ${getErrorMessage(error)}`);
  }
};

export const updateTodo = (id: number, completed: boolean): Todo | null => {
  try {
    const stmt = db.prepare(`
      UPDATE todos SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    const result = stmt.run(completed ? 1 : 0, id);
    return result.changes ? getTodoById(id) : null;
  } catch (error) {
    throw new Error(`Failed to update todo ${id}: ${getErrorMessage(error)}`);
  }
};

export const deleteTodo = (id: number): boolean => {
  try {
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    return stmt.run(id).changes > 0;
  } catch (error) {
    throw new Error(`Failed to delete todo ${id}: ${getErrorMessage(error)}`);
  }
};

export const clearCompletedTodos = (): void => {
  try {
    db.prepare('DELETE FROM todos WHERE completed = 1').run();
  } catch (error) {
    throw new Error(`Failed to clear completed todos: ${getErrorMessage(error)}`);
  }
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}