import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/AuthForms.module.css';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/tasks');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;