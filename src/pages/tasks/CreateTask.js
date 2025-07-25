// src/pages/tasks/CreateTask.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/CreateTask.module.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get('http://localhost:5001/api/tasks', {
    //       headers: { Authorization: `Bearer ${token}` }
    //     });
    //     setUsers(response.data);
    //   } catch (err) {
    //     setError(err.response?.data?.message || err.message);
    //   }
    // };
    const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5001/api/tasks/assignable-users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to load assignable users');
  }
};

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.createTaskContainer}>
      <h1>Create New Task</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.taskForm}>
        <div className={styles.formGroup}>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Assign To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/tasks')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;