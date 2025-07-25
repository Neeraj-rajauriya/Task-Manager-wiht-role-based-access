import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getUsers,
  getTaskById,
  updateTaskStatus
} from '../contollers/taskContoller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createTask); // Create Task
router.get('/', verifyToken, getTasks);    // Get Tasks
router.get('/assignable-users', verifyToken, getUsers);
router.get('/:id', verifyToken, getTaskById); 
router.put('/:id', verifyToken, updateTask);          // For general task updates
router.put('/:id/status', verifyToken, updateTaskStatus); // For status updates only
router.delete('/:id', verifyToken, deleteTask); // Delete Task (CEO only)

export default router;
