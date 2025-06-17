import { Request, Response, NextFunction } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
} from '../services/todoService';

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await getAllTodos();
    res.status(200).send({ status: 'OK', data: todos });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ status: 'FAILED', data: { error: 'Invalid todo ID' } });
    }

    const todo = await getTodoById(id);
    if (!todo) {
      return res.status(404).send({ status: 'FAILED', data: { error: 'Todo not found' } });
    }

    res.status(200).send({ status: 'OK', data: todo });
  } catch (error) {
    res.status(500).send({
      status: 'FAILED',
      data: { error: 'An error occurred while fetching the todo' },
    });
    console.error('Error fetching todo:', error);
    return;
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).send({
        status: 'FAILED',
        data: { error: 'Title is required and must be a string' },
      });
    }

    const todo = await createTodo(title);
    res.status(201).send({ status: 'OK', data: todo });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { completed } = req.body;

    if (isNaN(id)) {
      return res.status(400).send({ status: 'FAILED', data: { error: 'Invalid todo ID' } });
    }

    if (typeof completed !== 'boolean') {
      return res.status(400).send({
        status: 'FAILED',
        data: { error: 'Completed must be a boolean' },
      });
    }

    const updated = await updateTodo(id, completed);
    if (!updated) {
      return res.status(404).send({ status: 'FAILED', data: { error: 'Todo not found' } });
    }

    res.status(200).send({ status: 'OK', data: updated });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).send({ status: 'FAILED', data: { error: 'Invalid todo ID' } });
    }

    const deleted = await deleteTodo(id);
    if (!deleted) {
      return res.status(404).send({ status: 'FAILED', data: { error: 'Todo not found' } });
    }

    res.status(200).send({ status: 'OK', data: { message: 'Todo deleted' } });
  } catch (error) {
    next(error);
  }
};

export const clearCompleted = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await clearCompletedTodos();
    res.status(200).send({ status: 'OK', data: { message: 'Completed todos cleared' } });
  } catch (error) {
    next(error);
  }
};
