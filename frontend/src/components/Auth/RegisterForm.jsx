import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './RegisterForm.module.css';
import common from '../common.module.css';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const { register, handleSubmit, watch, formState: { errors } } = useForm();
	const password = watch('password');

	const handleRegister = data => {
		onSubmit(data);
		navigate('/podcasts');
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
				<input id="password" type="password" {...register('password', { required: 'Введіть пароль', minLength: { value: 6, message: 'Мінімум 6 символів' } })} />
				{errors.password && <span className={common.error}>{errors.password.message}</span>}
			</div>

			<div className={common.field}>
				<label htmlFor="confirm">Підтвердіть пароль</label>
				<input id="confirm" type="password" {...register('confirm', { required: 'Підтвердіть пароль', validate: value => value === password || 'Паролі не співпадають' })} />
				{errors.confirm && <span className={common.error}>{errors.confirm.message}</span>}
			</div>

			<button className={common.button} type="submit">Зареєструватися</button>
		</form>
	);
};

export default RegisterForm; 	