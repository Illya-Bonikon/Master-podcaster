import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ProfilePage.module.css';
import common from '../common.module.css';
import { getMe, updateMe, getMyPodcasts } from '../../api';
import LoadingOverlay from '../LoadingOverlay';

const ProfilePage = () => {
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState(null);
	const [podcastsCount, setPodcastsCount] = useState(null);

	const token = localStorage.getItem('token');

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm();

	const fetchUserData = async () => {
		setLoading(true);
		try {
			const [userRes, podcastsRes] = await Promise.all([
				getMe(token),
				getMyPodcasts(token)
			]);

			setUser(userRes.data);
			setPodcastsCount(podcastsRes.data.length);

			// Заповнення форми
			setValue('name', userRes.data.displayName);
			setValue('email', userRes.data.email);
			setValue('password', '');
			setValue('confirmPassword', '');
		} catch (e) {
			alert('Помилка отримання профілю: ' + (e.response?.data?.message || e.message));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, [token]);

	const onSubmit = async (data) => {
		setLoading(true);
		try {
			await updateMe(
				{
					email: data.email,
					password: data.password || undefined,
					displayName: data.name
				},
				token
			);
			await fetchUserData();
			setEditMode(false);
			alert('Профіль оновлено!');
		} catch (e) {
			alert('Помилка оновлення профілю: ' + (e.response?.data?.message || e.message));
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && <LoadingOverlay message="Завантаження або збереження профілю..." />}
			<div className={common.profile}>
				<h2>Профіль</h2>

				{editMode ? (
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.info}>
							<label htmlFor="name">Нікнейм</label>
							<input
								id="name"
								{...register('name', { required: 'Введіть нікнейм' })}
								placeholder="Ваш нікнейм"
							/>
							{errors.name && <span className={common.error}>{errors.name.message}</span>}
						</div>

						<div className={styles.info}>
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								{...register('email', { required: 'Введіть email' })}
								placeholder="Ваш email"
							/>
							{errors.email && <span className={common.error}>{errors.email.message}</span>}
						</div>

						<div className={styles.info}>
							<label htmlFor="password">Новий пароль</label>
							<input
								id="password"
								type="password"
								{...register('password', {
									minLength: { value: 6, message: 'Мінімум 6 символів' }
								})}
								placeholder="Новий пароль"
							/>
							{errors.password && <span className={common.error}>{errors.password.message}</span>}
						</div>

						<div className={styles.info}>
							<label htmlFor="confirmPassword">Повторіть пароль</label>
							<input
								id="confirmPassword"
								type="password"
								{...register('confirmPassword', {
									validate: (value) =>
										value === watch('password') || 'Паролі не збігаються'
								})}
								placeholder="Повторіть новий пароль"
							/>
							{errors.confirmPassword && <span className={common.error}>{errors.confirmPassword.message}</span>}
						</div>

						<div className={styles.editBtns}>
							<button type="button" className={common.button} onClick={() => setEditMode(false)} disabled={loading}>
								Скасувати
							</button>
							<button type="submit" className={common.button} disabled={loading}>
								Підтвердити
							</button>
						</div>
					</form>
				) : (
					<>
						<div className={styles.info}><b>Нікнейм:</b> {user?.displayName}</div>
						<div className={styles.info}><b>Email:</b> {user?.email}</div>
						<div className={styles.info}><b>Кількість подкастів:</b> {podcastsCount}</div>
						<button className={common.editBtn} onClick={() => setEditMode(true)}>
							Редагувати
						</button>
						<button
							className={common.deleteBtn}
							style={{ marginTop: '1rem' }}
							onClick={() => {
								if (window.confirm('Ви дійсно бажаєте вийти з акаунту?')) {
									localStorage.removeItem('token');
									localStorage.removeItem('role');
									window.dispatchEvent(new Event('tokenChanged'));
									window.location.href = '/';
								}
							}}
						>
							Вийти
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default ProfilePage;
