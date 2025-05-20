import React from 'react';
import styles from './Header.module.css';

const Header = () => {
	return (
		<header className={styles.header}>
		<div className={styles.logo}>Podcaster</div>
			<input className={styles.search} type="text" placeholder="Пошук..." />
		<div className={styles.user}>Ім'я</div>
		</header>
	);
};

export default Header; 