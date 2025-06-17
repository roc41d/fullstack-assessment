import { getDb } from "../database/connection";
import { Todo, CreateTodoDto, UpdateTodoDto } from "../types/todo";

export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const db = await getDb();
    return await db.all<Todo[]>("SELECT * FROM todos ORDER BY created_at DESC");
  } catch (error) {
    throw new Error(
      `Failed to fetch todos: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const getTodoById = async (id: number): Promise<Todo | undefined> => {
  try {
    const db = await getDb();
    return await db.get<Todo>("SELECT * FROM todos WHERE id = ?", id);
  } catch (error) {
    throw new Error(
      `Failed to fetch todo ${id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const createTodo = async (newTodo: CreateTodoDto): Promise<Todo> => {
  try {
    const db = await getDb();

    const { lastID } = await db.run(
      "INSERT INTO todos (title, completed) VALUES (?, ?)",
      [newTodo.title, newTodo.completed]
    );

    const todo = await getTodoById(lastID);
    if (!todo) throw new Error("Failed to retrieve created todo");
    return todo;
  } catch (error) {
    throw new Error(
      `Failed to create todo: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const updateTodo = async (
  updateTodoDto: UpdateTodoDto
): Promise<Todo> => {
  try {
    const db = await getDb();

    const { changes } = await db.run(
      `UPDATE todos 
       SET title = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [updateTodoDto.title, updateTodoDto.id]
    );

    if (changes === 0) {
      throw new Error(`Todo with ID ${updateTodoDto.id} not found`);
    }

    const updatedTodo = await db.get<Todo>(
      "SELECT * FROM todos WHERE id = ?",
      updateTodoDto.id
    );

    if (!updatedTodo) {
      throw new Error("Failed to fetch updated todo");
    }

    return updatedTodo;
  } catch (error) {
    throw new Error(
      `Failed to update todo title: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const markTodoComplete = async (id: number): Promise<Todo> => {
  try {
    const db = await getDb();

    const { changes } = await db.run(
      `UPDATE todos 
       SET completed = 1, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [id]
    );

    if (changes === 0) {
      throw new Error(`Todo with ID ${id} not found`);
    }

    const updatedTodo = await db.get<Todo>("SELECT * FROM todos WHERE id = ?", [
      id,
    ]);

    if (!updatedTodo) {
      throw new Error("Failed to fetch updated todo");
    }

    return updatedTodo;
  } catch (error) {
    throw new Error(
      `Failed to mark todo ${id} as complete: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    const db = await getDb();
    const { changes } = await db.run("DELETE FROM todos WHERE id = ?", [id]);
    if (changes === 0) throw new Error("Todo not found");
  } catch (error) {
    throw new Error(
      `Failed to delete todo ${id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const clearCompletedTodos = async (): Promise<{ count: number }> => {
  try {
    const db = await getDb();
    const { changes } = await db.run("DELETE FROM todos WHERE completed = 1");
    return { count: changes };
  } catch (error) {
    throw new Error(
      `Failed to clear completed todos: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
