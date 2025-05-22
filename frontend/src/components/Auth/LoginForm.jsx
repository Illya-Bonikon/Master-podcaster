import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm();

	const handleLogin = data => {
		onSubmit(data);
		navigate('/podcasts');
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
			<h2 className={styles.title}>Вхід</h2>
			
			<div className={styles.field}>
				<label htmlFor="email">Email</label>
				<input id="email" type="email" {...register('email', { required: 'Введіть email' })} />
				{errors.email && <span className={styles.error}>{errors.email.message}</span>}
			</div>
			
			<div className={styles.field}>
				<label htmlFor="password">Пароль</label>
				<input id="password" type="password" {...register('password', { required: 'Введіть пароль' })} />
				{errors.password && <span className={styles.error}>{errors.password.message}</span>}
			</div>
			
			<button className={styles.button} type="submit">Увійти</button>
		</form>
	);
}; 

export default LoginForm; 