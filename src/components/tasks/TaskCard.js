// src/components/tasks/TaskCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/TaskCard.module.css';
import { format } from 'date-fns';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  
  const getPriorityColor = () => {
    switch(task.priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusColor = () => {
    switch(task.status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Blocked': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div 
      className={styles.taskCard}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <span 
          className={styles.priorityBadge}
          style={{ backgroundColor: getPriorityColor() }}
        >
          {task.priority}
        </span>
      </div>
      
      <p className={styles.taskDescription}>
        {task.description || 'No description provided'}
      </p>
      
      <div className={styles.taskMeta}>
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor() }}
        >
          {task.status}
        </span>
        
        {task.dueDate && (
          <span className={styles.dueDate}>
            Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>
      
      <div className={styles.taskFooter}>
        <span className={styles.assignedTo}>
          Assigned to: {task.assignedTo?.name || 'Unassigned'}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;