import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../contollers/taskContoller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTask); // Create Task
router.get('/', verifyToken, getTasks);    // Get Tasks
router.put('/:id', verifyToken, updateTask); // Update Task
router.delete('/:id', verifyToken, deleteTask); // Delete Task (CEO only)

export default router;
