// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const HomePage = () => {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <h1>Welcome to Task Manager</h1>
        <p>Organize your work and boost your productivity</p>
        
        <div className={styles.ctaButtons}>
          <Link to="/login" className={styles.primaryButton}>Login</Link>
          <Link to="/register" className={styles.secondaryButton}>Register</Link>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <h2>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3>Task Management</h3>
            <p>Create, organize, and prioritize your tasks efficiently</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Team Collaboration</h3>
            <p>Work seamlessly with your team members</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Progress Tracking</h3>
            <p>Monitor your progress with intuitive analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;