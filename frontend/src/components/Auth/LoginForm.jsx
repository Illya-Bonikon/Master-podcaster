import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import common from '../common.module.css';
import styles from './LoginForm.module.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api';
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const [serverError, setServerError] = useState('');
	const { register, handleSubmit, formState: { errors }, setError, resetField } = useForm({ mode: 'onChange' });
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async data => {
		setServerError('');
		try {
			const res = await login(data);
			localStorage.setItem('token', res.data.token);
			window.dispatchEvent(new Event('tokenChanged'));
			let decoded = {};
			try {
				decoded = jwtDecode(res.data.token);
				if (decoded.role) localStorage.setItem('role', decoded.role);
			} catch {}
			if (decoded.role === 'moderator') 
				navigate('/users');
			else
				navigate('/library');
		} catch (e) {
			if (e.response?.status === 401) {
				setServerError('Неправильний email або пароль');
				resetField('password');
			} else {
				setServerError(e.response?.data?.message || e.message);
			}
		}
	};
	return (
		<form className={common.form} onSubmit={handleSubmit(handleLogin)}>
			<h2 className={common.title}>Вхід</h2>
			{serverError && <div className={common.error} style={{marginBottom:8}}>{serverError}</div>}
			<div className={common.field}>
				<label htmlFor="email">Email</label>
				<input id="email" type="email" {...register('email', {
					required: 'Введіть email',
					pattern: {
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: 'Некоректний формат email'
					}
				})} />
				{errors.email && <span className={common.error}>{errors.email.message}</span>}
			</div>
			<div className={common.field} style={{position:'relative'}}>
				<label htmlFor="password">Пароль</label>
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					{...register('password', { required: 'Введіть пароль' })}
					style={{paddingRight: 36}}
				/>
				<button
					type="button"
					onClick={() => setShowPassword(v => !v)}
					style={{
						position: 'absolute',
						top: 32,
						right: 8,
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						padding: 0,
						fontSize: 20
					}}
					aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
				>
					{showPassword ? '🙈' : '👁️'}
				</button>
				{errors.password && <span className={common.error}>{errors.password.message}</span>}
			</div>
			<button className={common.button} type="submit">Увійти</button>
		</form>
	);
}; 

export default LoginForm; 