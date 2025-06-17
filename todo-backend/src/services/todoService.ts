import { getDb } from "../database/connection";
import { Todo, CreateTodoDto } from "../types/todo";

export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const db = await getDb();
    return await db.all<Todo[]>("SELECT * FROM todos ORDER BY created_at DESC");
  } catch (error) {
    throw error;
  }
};

export const getTodoById = async (id: number): Promise<Todo | undefined> => {
  try {
    const db = await getDb();
    return await db.get<Todo>("SELECT * FROM todos WHERE id = ?", id);
  } catch (error) {
    throw error;
  }
};

export const createTodo = async (data: CreateTodoDto): Promise<Todo> => {
  try {
    const db = await getDb();
    const { title, completed = false } = data;

    const { lastID } = await db.run(
      "INSERT INTO todos (title, completed) VALUES (?, ?)",
      [title, completed ? 1 : 0]
    );

    const todo = await getTodoById(lastID);
    if (!todo) throw new Error("Failed to retrieve created todo");
    return todo;
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (
  id: number,
  completed: boolean
): Promise<Todo> => {
  const db = await getDb();

  const { changes } = await db.run(
    `UPDATE todos 
       SET completed = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    [completed ? 1 : 0, id]
  );

  if (changes === 0) {
    throw new Error(`Todo with ID ${id} not found`);
  }

  const updatedTodo = await getTodoById(id);
  if (!updatedTodo) {
    throw new Error("Failed to fetch updated todo");
  }

  return updatedTodo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    const db = await getDb();
    const { changes } = await db.run("DELETE FROM todos WHERE id = ?", id);
    if (changes === 0) throw new Error("Todo not found");
  } catch (error) {
    throw error;
  }
};
