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
      // CEO can see all tasks
      tasks = await Task.find().populate('createdBy assignedTo');
    } else if (role === 'Manager') {
      // Manager can see:
      // 1. Tasks assigned to them (by CEO)
      // 2. Tasks they assigned to others
      tasks = await Task.find({
        $or: [
          { assignedTo: userId },  // Tasks assigned to manager
          { createdBy: userId }     // Tasks created by manager (assigned to others)
        ]
      }).populate('createdBy assignedTo');
    } else {
      // Team Members/Interns can only see tasks assigned to them
      tasks = await Task.find({ assignedTo: userId }).populate('createdBy assignedTo');
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;
  const userId = req.user.userId;

  try {
    const task = await Task.findById(id).populate('createdBy assignedTo');
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (role === 'CEO') {
      // CEO has full access to view any task
      return res.status(200).json(task);
    }

    if (role === 'Manager') {
      // Manager can view:
      // 1. Tasks assigned to them
      // 2. Tasks they created (assigned to others)
      if (String(task.assignedTo._id) !== userId && String(task.createdBy._id) !== userId) {
        return res.status(403).json({ message: "You are not allowed to view this task" });
      }
    }

    if (['TeamMember', 'Intern'].includes(role)) {
      // Team Members/Interns can only view tasks assigned to them
      if (String(task.assignedTo._id) !== userId) {
        return res.status(403).json({ message: "You are not allowed to view this task" });
      }
    }

    res.status(200).json(task);
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
    // First find the task to check permissions
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Prepare the updates object
    let allowedUpdates = { ...updates };

    // CEO can update any task details (except status)
    if (role === 'CEO') {
      // Remove status from updates if present
      delete allowedUpdates.status;
      
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        allowedUpdates,
        { 
          new: true,
          runValidators: true  // Ensure updates pass schema validation
        }
      )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found after update" });
      }

      return res.status(200).json({ 
        success: true,
        message: "Task updated successfully", 
        task: updatedTask 
      });
    }

    // Manager can only update tasks they created
    if (role === 'Manager') {
      if (String(task.createdBy) !== userId) {
        return res.status(403).json({ 
          success: false,
          message: "You can only edit tasks you created" 
        });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updates,
        { 
          new: true,
          runValidators: true
        }
      )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

      return res.status(200).json({ 
        success: true,
        message: "Task updated successfully", 
        task: updatedTask 
      });
    }

    // Others can't update task details at all
    return res.status(403).json({ 
      success: false,
      message: "You don't have permission to edit tasks" 
    });

  } catch (err) {
    console.error("Error updating task:", err);
    
    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors
      });
    }

    // Handle cast errors (invalid ID format)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format"
      });
    }

    // Generic error handler
    res.status(500).json({ 
      success: false,
      message: err.message || "Internal server error" 
    });
  }
};


export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.userId;
  const role = req.user.role;

  try {
    // Find and update the task in one operation with population
    const task = await Task.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true }
    )
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // CEO cannot update status
    if (role === 'CEO') {
      return res.status(403).json({ message: "CEO cannot update task status" });
    }

    // Manager can only update status of tasks assigned to them
    if (role === 'Manager' && String(task.assignedTo._id) !== userId) {
      return res.status(403).json({ 
        message: "Manager can only update status of tasks assigned to themselves" 
      });
    }

    // TeamMember/Intern can only update their own tasks' status
    if ((role === 'TeamMember' || role === 'Intern') && 
        String(task.assignedTo._id) !== userId) {
      return res.status(403).json({ 
        message: "You can only update status of your assigned tasks" 
      });
    }

    // Interns can only mark as 'Completed'
    if (role === 'Intern' && status !== 'Completed') {
      return res.status(403).json({ 
        message: "Interns can only mark tasks as 'Completed'" 
      });
    }

    res.status(200).json({ 
      success: true,
      message: "Task status updated", 
      task 
    });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
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

export const getUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let assignableRoles = [];
    
    // Define who can assign to whom
    switch(currentUser.role) {
      case 'CEO':
        assignableRoles = ['Manager', 'TeamMember', 'Intern'];
        break;
      case 'Manager':
        assignableRoles = ['TeamMember', 'Intern'];
        break;
      default:
        return res.status(200).json([]);
    }

    const users = await User.find({
      role: { $in: assignableRoles },
      _id: { $ne: req.user.userId } // Exclude self
    }).select('_id name email role department');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ 
      message: err.message || 'Error fetching assignable users'
    });
  }
};