// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TaskDetail from './pages/tasks/TaskDetails';
import CreateTask from './pages/tasks/CreateTask';
import AuthLayout from './components/auth/AuthLayout';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
// import TaskList from './pages/tasks/TaskList.js';
import TaskList from './pages/tasks/TaskList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
          <Route path="/tasks/create" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
          <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/auth/LoginPage';
// import RegisterPage from './pages/auth/RegisterPage';
// import AuthLayout from './components/auth/AuthLayout';
// import MainLayout from './components/MainLayout'; // You'll need to create this

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public routes with AuthLayout */}
//         <Route element={<AuthLayout />}>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//         </Route>

//         {/* Main app routes with different layout */}
//         <Route path="/" element={<MainLayout />}>
//           <Route index element={<HomePage />} />
//           {/* Add other protected routes here later */}
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;