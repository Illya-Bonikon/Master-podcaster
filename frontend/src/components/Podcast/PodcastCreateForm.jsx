import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './PodcastCreateForm.module.css';


const PodcastCreateForm = ({ onSubmit }) => {
	const navigate = useNavigate();
	const { register, handleSubmit, formState: { errors } } = useForm();

	const handleFormSubmit = async (data) => {
		if (onSubmit) await onSubmit(data);
		navigate(`/podcast/123`);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
		
			<h2 className={styles.title}>Створити подкаст</h2>
			
			<div className={styles.field}>
				<label>Назва</label>
				<input {...register('title', { required: 'Введіть назву' })} />
				{errors.title && <span className={styles.error}>{errors.title.message}</span>}
			</div>

			<div className={styles.field}>
				<label>Промпт (опис)</label>
				<textarea {...register('description', { required: 'Введіть опис' })} placeholder="Опишіть ідею подкасту..." />
				{errors.description && <span className={styles.error}>{errors.description.message}</span>}
			</div>
			
			
			<div className={styles.field}>
				<label>Видимість</label>
				<select {...register('status')}>
					<option value="public">Публічний</option>
					<option value="private">Приватний</option>
				</select>
			</div>
			
			<button className={styles.button} type="submit">Створити</button>
		</form>
	);
};

export default PodcastCreateForm; 