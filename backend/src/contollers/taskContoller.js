import Task from '../models/taskModel.js';
import User from '../models/userModel.js';

export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;
  const role = req.user.role;

  try {
    if (role === 'Manager') {
      const assignedUser = await User.findById(assignedTo);
      if (!['TeamMember', 'Intern'].includes(assignedUser.role)) {
        return res.status(403).json({ message: "Manager can only assign tasks to Team Members or Interns" });
      }
    }

    if (role === 'TeamMember' || role === 'Intern') {
      return res.status(403).json({ message: "You don't have permission to create tasks" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user.userId,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTasks = async (req, res) => {
  const role = req.user.role;
  const userId = req.user.userId;

  try {
    let tasks;

    if (role === 'CEO') {
      tasks = await Task.find().populate('createdBy assignedTo');
    } else if (role === 'Manager') {
      tasks = await Task.find({ createdBy: userId }).populate('createdBy assignedTo');
    } else {
      tasks = await Task.find({ assignedTo: userId }).populate('createdBy assignedTo');
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role === 'CEO') {
      Object.assign(task, updates);
    } else if (role === 'Manager') {
      if (String(task.createdBy) !== userId)
        return res.status(403).json({ message: "You can only update tasks you created" });
      Object.assign(task, updates);
    } else if (role === 'TeamMember') {
      if (String(task.assignedTo) !== userId)
        return res.status(403).json({ message: "You can only update your own tasks" });
      task.status = updates.status; 
    } else if (role === 'Intern') {
      if (String(task.assignedTo) !== userId)
        return res.status(403).json({ message: "You can only update your own tasks" });
      if (updates.status !== 'Completed')
        return res.status(403).json({ message: "Intern can only mark task as completed" });
      task.status = 'Completed';
    }

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;

  try {
    if (role !== 'CEO') {
      return res.status(403).json({ message: "Only CEO can delete tasks" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
