// // src/pages/tasks/TaskList.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import TaskCard from '../../components/tasks/TaskCard';
// import TaskFilter from '../../components/tasks/TaskFilter';
// import styles from '../../styles/TaskList.module.css';

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:5001/api/tasks', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setTasks(response.data);
//         setFilteredTasks(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//         setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);



//   const handleFilterChange = (filters) => {
//     let result = [...tasks];
    
//     if (filters.status) {
//       result = result.filter(task => task.status === filters.status);
//     }
    
//     if (filters.priority) {
//       result = result.filter(task => task.priority === filters.priority);
//     }
    
//     setFilteredTasks(result);
//   };

//   if (loading) return <div className={styles.loading}>Loading tasks...</div>;
//   if (error) return <div className={styles.error}>Error: {error}</div>;

//   return (
//     <div className={styles.taskListContainer}>
//       <div className={styles.taskListHeader}>
//         <h1>Your Tasks</h1>
//         <button 
//           onClick={() => navigate('/tasks/create')} 
//           className={styles.createButton}
//         >
//           + Create New Task
//         </button>
//       </div>

//       <TaskFilter onFilterChange={handleFilterChange} />

//       <div className={styles.taskGrid}>
//         {filteredTasks.length > 0 ? (
//           filteredTasks.map(task => (
//             <TaskCard key={task._id} task={task} />
//           ))
//         ) : (
//           <div className={styles.noTasks}>No tasks found matching your criteria</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TaskList;

// src/pages/tasks/TaskList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilter from '../../components/tasks/TaskFilter';
import styles from '../../styles/TaskList.module.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasksAndUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // First get user role
        const userResponse = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserRole(userResponse.data.role);
        
        // Then get tasks
        const tasksResponse = await axios.get('http://localhost:5001/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksResponse.data);
        setFilteredTasks(tasksResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchTasksAndUser();
  }, []);

  const handleCreateClick = () => {
    if (userRole === 'Intern') {
      alert("You don't have permission to create tasks");
    } else {
      navigate('/tasks/create');
    }
  };

  const handleFilterChange = (filters) => {
    let result = [...tasks];
    
    if (filters.status) {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    setFilteredTasks(result);
  };

  if (loading) return <div className={styles.loading}>Loading tasks...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.taskListHeader}>
        <h1>Your Tasks</h1>
        <button 
          onClick={handleCreateClick}
          className={`${styles.createButton} ${
            userRole === 'Intern' ? styles.disabledButton : ''
          }`}
          disabled={userRole === 'Intern'}
        >
          + Create New Task
        </button>
      </div>

      <TaskFilter onFilterChange={handleFilterChange} />

      <div className={styles.taskGrid}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))
        ) : (
          <div className={styles.noTasks}>No tasks found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;