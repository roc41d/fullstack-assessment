import { updateTodo } from "./../services/todoService";
import { Request, Response, NextFunction } from "express";
import * as TodoService from "../services/todoService";
import { CreateTodoDto, UpdateTodoDto } from "../types/todo";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await TodoService.getAllTodos();
    res.status(200).send({ status: "OK", data: todos });
  } catch (error) {
    next(error);
  }
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res
        .status(400)
        .send({ status: "FAILED", data: { error: "Invalid todo ID" } });
    }

    const todo = await TodoService.getTodoById(id);
    if (!todo) {
      res
        .status(404)
        .send({ status: "FAILED", data: { error: "Todo not found" } });
    }

    res.status(200).send({ status: "OK", data: todo });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      res.status(400).send({
        status: "FAILED",
        data: { error: "Title is required and must be a string" },
      });
    }

    const newTodo: CreateTodoDto = {
      title: title,
      completed: false,
    };

    const todo = await TodoService.createTodo(newTodo);
    res.status(201).json({
      status: "OK",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        status: "FAILED",
        data: { error: "Invalid todo ID" },
      });
    }

    if (!title || typeof title !== "string") {
      res.status(400).json({
        status: "FAILED",
        data: { error: "Valid title string is required" },
      });
    }

    const updateTodoDto: UpdateTodoDto = {
      id,
      title,
    };

    const updatedTodo = await TodoService.updateTodo(updateTodoDto);
    res.status(200).json({
      status: "OK",
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

export const completeTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        status: "FAILED",
        data: { error: "Invalid todo ID" },
      });
    }

    const completedTodo = await TodoService.markTodoComplete(id);
    res.status(200).json({
      status: "OK",
      data: completedTodo,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res
        .status(400)
        .send({ status: "FAILED", data: { error: "Invalid todo ID" } });
    }

    await TodoService.deleteTodo(id);
    res.status(200).send({ status: "OK", data: { message: "Todo deleted" } });
  } catch (error) {
    next(error);
  }
};

export const clearCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { count } = await TodoService.clearCompletedTodos();
    res.status(200).send({
      status: "OK",
      data: {
        message: `Cleared ${count} completed todos`,
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
