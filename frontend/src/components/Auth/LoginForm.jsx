import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginForm.module.css';
import common from '../common.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm();

	const handleLogin = async data => {
		try {
			const res = await login(data);
			localStorage.setItem('token', res.data.token);
			let decoded = {};
			try {
				decoded = jwtDecode(res.data.token);
			} catch {}
			if (decoded.role === 'moderator') 
				navigate('/users');
			else
				navigate('/library');
		} catch (e) {
			alert('Помилка входу: ' + (e.response?.data?.message || e.message));
		}
	};

	return (
		<form className={common.form} onSubmit={handleSubmit(handleLogin)}>
			<h2 className={common.title}>Вхід</h2>
			
			<div className={common.field}>
				<label htmlFor="email">Email</label>
				<input id="email" type="email" {...register('email', { required: 'Введіть email' })} />
				{errors.email && <span className={common.error}>{errors.email.message}</span>}
			</div>
			
			<div className={common.field}>
				<label htmlFor="password">Пароль</label>
				<input id="password" type="password" {...register('password', { required: 'Введіть пароль' })} />
				{errors.password && <span className={common.error}>{errors.password.message}</span>}
			</div>
			
			<button className={common.button} type="submit">Увійти</button>
		</form>
	);
}; 

export default LoginForm; 