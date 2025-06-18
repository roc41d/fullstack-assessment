import { Router } from 'express';
import * as TodoController from '../controllers/todoController';


const router = Router();

router.get('/', TodoController.list);
router.get('/:id', TodoController.show);
router.post('/', TodoController.create);
router.put('/:id/complete', TodoController.completeTodo);
router.put('/:id', TodoController.update);
router.delete('/:id', TodoController.remove);
router.delete('/completed', TodoController.clearCompleted);

export default router;
