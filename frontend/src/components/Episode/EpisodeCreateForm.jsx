import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './EpisodeCreateForm.module.css';

const EpisodeCreateForm = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<h2 className={styles.title}>Створити епізод</h2>
			
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
			

			
			{/* TODO подумати чи мають бути додаткові поля  */}



			<button className={styles.button} type="submit">Створити</button>
		</form>
  );	
};

export default EpisodeCreateForm; 