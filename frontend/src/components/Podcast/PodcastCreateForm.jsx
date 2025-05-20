import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './PodcastCreateForm.module.css';


// TODO: обговорити з Миколою поля, мб подумавти про їх валідацію

const PodcastCreateForm = ({ onSubmit }) => {
	const { register, handleSubmit, formState: { errors } } = useForm();

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
		
			<h2 className={styles.title}>Створити подкаст</h2>
			
			<div className={styles.field}>
				<label>Назва</label>
				<input {...register('title', { required: 'Введіть назву' })} />
				{errors.title && <span className={styles.error}>{errors.title.message}</span>}
			</div>
			
			<div className={styles.field}>
				<label>Опис</label>
				<textarea {...register('description', { required: 'Введіть опис' })} />
				{errors.description && <span className={styles.error}>{errors.description.message}</span>}
			</div>
			
			<div className={styles.field}>
				<label>Теги (через кому)</label>
				<input {...register('tags')} />
			</div>
			
			<div className={styles.field}>
				<label>Видимість</label>
				<select {...register('status')}>
					<option value="public">Публічний</option>
					<option value="private">Приватний</option>
				</select>
			</div>
			
			<div className={styles.field}>
				<label>Обкладинка (URL або файл)</label>
				<input type="file" {...register('coverFile')} />
			</div>
			
			<button className={styles.button} type="submit">Створити</button>
		</form>
	);
};

export default PodcastCreateForm; 