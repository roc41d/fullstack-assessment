import { create } from 'domain';
import { Router } from 'express';
import { getAll, getById, update, remove, clearCompleted } from '../controllers/todoController';


const router = Router();

// GET /todos - fetch all todos
router.get('/', getAll);

// GET /todos/:id - fetch a specific todo by ID
router.get('/:id', getById);

// POST /todos - create a new todo
router.post('/', create);

// PUT /todos/:id - update completed status
router.put('/:id', update);

// DELETE /todos/:id - delete a todo
router.delete('/:id', remove);

// DELETE /todos/completed - delete all completed todos
router.delete('/completed', clearCompleted);

export default router;
