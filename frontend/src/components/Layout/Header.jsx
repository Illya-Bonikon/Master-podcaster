import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { FaUserAlt } from 'react-icons/fa';
import { GiBookshelf } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const Header = () => {
	const navigate = useNavigate();
	const [darkMode, setDarkMode] = useState(() => getSystemTheme() === 'dark');

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
	}, [darkMode]);

	return (
		<header className={styles.header}>
			<div className={styles.left}>
				<button className={styles.iconBtn} onClick={() => navigate('/library')} title="Бібліотека">
				<GiBookshelf className={styles.icon} />
				</button>
				
				<button className={styles.iconBtn} onClick={() => navigate('/profile')} title="Профіль">
				<FaUserAlt className={styles.icon} />
				</button>
			</div>

			<div className={styles.searchSection}>
				<input
				type="text"
				placeholder="Пошук..."
				className={styles.searchInput}
				/>
			</div>

			<div className={styles.right}>
				<div className={styles.theme}>
					<input
						type="checkbox"
						id="themeSwitch"
						className={styles.themeSwitchInput}
						checked={darkMode}
						onChange={e => setDarkMode(e.target.checked)}
					/>
					
					<label htmlFor="themeSwitch" className={styles.themeSwitchLabel}>
						<span className={styles.slider}></span>
					</label>
				</div>
			</div>
		</header>
	);
};

export default Header;
