import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/AuthForms.module.css';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5001/api/auth/register', data);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label>Role</label>
          <select {...register('role')} defaultValue="Intern">
            <option value="CEO">CEO</option>
            <option value="Manager">Manager</option>
            <option value="TeamMember">Team Member</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
        
        <button type="submit" className={styles.submitButton}>Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;