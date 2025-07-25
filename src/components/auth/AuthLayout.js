// import React from 'react';
// import { Link, Outlet } from 'react-router-dom';
// import styles from '../../styles/Auth.module.css';

// const AuthLayout = () => {
//   return (
//     <div className={styles.authLayout}>
//       <nav className={styles.authNav}>
//         <Link to="/" className={styles.logo}>Task Manager</Link>
//         <div className={styles.authLinks}>
//           <Link to="/login" className={styles.link}>Login</Link>
//           <Link to="/register" className={styles.link}>Register</Link>
//         </div>
//       </nav>

//       <main className={styles.authMain}>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AuthLayout;


import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from '../../styles/Auth.module.css';

const AuthLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.authLayout}>
      <nav className={styles.authNav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>📋</span>
          Task Manager
        </Link>

        <div className={styles.authLinks}>
          <Link 
            to="/login" 
            className={`${styles.link} ${isActive('/login') ? styles.activeLink : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className={`${styles.link} ${isActive('/register') ? styles.activeLink : ''}`}
          >
            Register
          </Link>
        </div>
      </nav>

      <main className={styles.authMain}>
        <Outlet />
      </main>

      <footer className={styles.authFooter}>
        © {new Date().getFullYear()} Task Manager. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
