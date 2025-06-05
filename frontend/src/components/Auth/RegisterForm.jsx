import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.css';
import common from '../common.module.css';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../../api';

const RegisterForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const password = watch('password');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleRegister = async data => {
		try {
			const restructureData = {
				email: data.email,
				password: data.password,
				displayName: data.name
			}
			console.log(restructureData);
			await registerAPI(restructureData);
			alert('Реєстрація успішна! Тепер увійдіть.');
			navigate('/login');
		} catch (e) {
			alert('Помилка реєстрації: ' + (e.response?.data?.message || e.message));
		}
	};

	return (
		<form className={common.form} onSubmit={handleSubmit(handleRegister)}>
			<h2 className={common.title}>Реєстрація</h2>

			<div className={common.field}>
				<label htmlFor="name">Ім'я</label>
				<input id="name" type="text" {...register('name', { required: 'Введіть ім\'я' })} />
				{errors.name && <span className={common.error}>{errors.name.message}</span>}
			</div>

			<div className={common.field}>
				<label htmlFor="email">Email</label>
				<input id="email" type="email" {...register('email', { required: 'Введіть email' })} />
				{errors.email && <span className={common.error}>{errors.email.message}</span>}
			</div>

			<div className={common.field}>
				<label htmlFor="password">Пароль</label>
				<div className={styles.inputWrapper}>
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						{...register('password', { required: 'Введіть пароль', minLength: { value: 6, message: 'Мінімум 6 символів' } })}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(v => !v)}
						className={styles.eyeButton}
						aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
					>
						{showPassword ? '🙈' : '👁️'}
					</button>
				</div>
				{errors.password && <span className={common.error}>{errors.password.message}</span>}
			</div>

			<div className={common.field}>
				<label htmlFor="confirm">Підтвердіть пароль</label>
				<div className={styles.inputWrapper}>
					<input
						id="confirm"
						type={showConfirm ? 'text' : 'password'}
						{...register('confirm', { required: 'Підтвердіть пароль', validate: value => value === password || 'Паролі не співпадають' })}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm(v => !v)}
						className={styles.eyeButton}
						aria-label={showConfirm ? 'Сховати пароль' : 'Показати пароль'}
					>
						{showConfirm ? '🙈' : '👁️'}
					</button>
				</div>
				{errors.confirm && <span className={common.error}>{errors.confirm.message}</span>}
			</div>

			<button className={common.button} type="submit">Зареєструватися</button>
		</form>
	);
};

export default RegisterForm; 	