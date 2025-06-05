import React, { useEffect, useState, useContext } from 'react';
import styles from './Header.module.css';
import { FaUserAlt, FaPlus, FaInfoCircle, FaBars, FaSearch, FaUsers } from 'react-icons/fa';
import { GiBookshelf, GiWorld } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import UsersModal from './UsersModal';
import { UserContext } from '../UserContext.jsx';

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const Header = () => {
	const navigate = useNavigate();
	const { isModerator } = useContext(UserContext);
	const [darkMode, setDarkMode] = useState(() => getSystemTheme() === 'dark');
	const [menuOpen, setMenuOpen] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
	}, [darkMode]);

	const handleSearch = () => {
		if (searchQuery.trim()) {
			navigate(`/searchpage?query=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery('');
			setShowSearch(false);
		}
	};

	return (
		<header className={styles.header}>
			{!showSearch && (
				<div className={styles.left}>
					<button className={styles.burgerBtn} onClick={() => setMenuOpen(!menuOpen)} title="Меню">
						<FaBars className={styles.icon} />
					</button>
					<button className={styles.iconBtn + ' ' + styles.mobileOnly} onClick={() => setShowSearch(true)} title="Пошук">
						<FaSearch className={styles.icon} />
					</button>
					{!isModerator && (
						<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/global')} title="Глобальні подкасти">
							<GiWorld className={styles.icon} />
						</button>
					)}
					{!isModerator && (
						<>
							<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/library')} title="Бібліотека">
								<GiBookshelf className={styles.icon} />
							</button>
							<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/podcast/create')} title="Додати подкаст">
								<FaPlus className={styles.icon} />
							</button>
						</>
					)}
				</div>
			)}
			{showSearch ? (
				<div className={styles.fullSearchSection}>
					<input
						type="text"
						placeholder="Пошук..."
						className={styles.fullSearchInput}
						style={{height: '64px'}}
						autoFocus
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						onBlur={() => setShowSearch(false)}
						onKeyDown={e => {
							if (e.key === 'Escape') setShowSearch(false);
							if (e.key === 'Enter') handleSearch();
						}}
					/>
					<button className={styles.iconBtn} style={{marginLeft: 8}} onClick={handleSearch} title="Пошук"><FaSearch className={styles.icon} /></button>
				</div>
			) : (
				<div className={styles.searchSection + ' ' + styles.desktopOnly}>
					<input
						type="text"
						placeholder="Пошук..."
						className={styles.searchInput}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
					/>
				</div>
			)}
			{!showSearch && (
				<div className={styles.right}>
					{!isModerator && (
						<>
							<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/profile')} title="Профіль">
								<FaUserAlt className={styles.icon} />
							</button>
							<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/about')} title="Про команду">
								<FaInfoCircle className={styles.icon} />
							</button>
						</>
					)}
					{isModerator && (
						<>
							<button className={styles.iconBtn + ' ' + styles.desktopOnly} onClick={() => navigate('/users')} title="Користувачі">
								<FaUsers className={styles.icon} />
							</button>
							<button
								className={"" + (styles.iconBtn || "") + " " + (styles.desktopOnly || "") + " " + (styles.logoutBtn || "")}
								style={{ marginLeft: 12, background: 'var(--color-danger, #e74c3c)', color: '#fff', borderRadius: 8, padding: '0.5em 1.2em', fontWeight: 600 }}
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
			)}
			<SideMenu open={menuOpen && !showSearch} onClose={() => setMenuOpen(false)} />
		</header>
	);
};

export default Header;
