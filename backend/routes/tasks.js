import { Router } from 'express';
import {
  getTasks,
  createTask,
  markToday,
  stopTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTask);
router.post('/tasks/:id/today', markToday);
router.post('/tasks/:id/stop', stopTask);
router.delete('/tasks/:id', deleteTask);

export default router;
