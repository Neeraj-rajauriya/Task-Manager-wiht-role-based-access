// Updated MainLayout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import styles from '../styles/MainLayout.module.css';

const MainLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={styles.mainLayout}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">Task Manager</Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          
          {user ? (
            <>
              <Link to="/tasks" className={styles.navLink}>Tasks</Link>
              <button onClick={handleLogout} className={styles.navLink}>
                Logout
              </button>
              <span className={styles.userWelcome}>Hi, {user.name}</span>
            </>
          ) : (
            <Link to="/login" className={styles.navLink}>Login</Link>
          )}
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;