// src/components/tasks/TaskFilter.js
import React, { useState } from 'react';
import styles from '../../styles/TaskFilter.module.css';

const TaskFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { status: '', priority: '' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="status">Status</label>
        <select 
          id="status" 
          name="status" 
          value={filters.status}
          onChange={handleChange}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="priority">Priority</label>
        <select 
          id="priority" 
          name="priority" 
          value={filters.priority}
          onChange={handleChange}
          className={styles.filterSelect}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <button 
        onClick={clearFilters} 
        className={styles.clearButton}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default TaskFilter;