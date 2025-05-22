import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.wrapper}>
			<div className={styles.logoBox}>
				<div className={styles.logo}>🎙️</div>
				<h1 className={styles.title}>Master Podcaster</h1>
			</div>
			
			<div className={styles.desc}>
				<p>Платформа для створення, прослуховування та обміну подкастами українською мовою. Долучайся до спільноти творців та слухачів!</p>
			</div>
			
			<div className={styles.btns}>
				<button className={styles.login} onClick={() => navigate('/login')}>Увійти</button>
				<button className={styles.register} onClick={() => navigate('/register')}>Реєстрація</button>
			</div>
		</div>
	);
};

export default WelcomePage; 