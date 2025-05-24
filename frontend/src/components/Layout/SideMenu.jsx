import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import styles from './Header.module.css';
import { FaUserAlt, FaPlus, FaInfoCircle, FaUsers } from 'react-icons/fa';
import { GiBookshelf, GiWorld } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext.jsx';

const SideMenuContent = ({ onClose, navigate }) => {
	const { isModerator } = useContext(UserContext);
	return (
		<>
			<div className={styles.sideMenuOverlay} onClick={onClose} />
			<nav className={styles.sideMenuLeft}>
				{isModerator && (
					<button onClick={() => {navigate('/users'); onClose();}}><FaUsers className={styles.icon}/> Користувачі<br/><span className={styles.menuDesc}>Модерація</span></button>
				)}
				{!isModerator && (
					<>
						<button onClick={() => {navigate('/library'); onClose();}}><GiBookshelf className={styles.icon}/> Бібліотека<br/><span className={styles.menuDesc}>Ваші подкасти</span></button>
						<button onClick={() => {navigate('/podcast/create'); onClose();}}><FaPlus className={styles.icon}/> Додати подкаст<br/><span className={styles.menuDesc}>Новий подкаст</span></button>
						<button onClick={() => {navigate('/profile'); onClose();}}><FaUserAlt className={styles.icon}/> Профіль<br/><span className={styles.menuDesc}>Ваш акаунт</span></button>
						<button onClick={() => {navigate('/about'); onClose();}}><FaInfoCircle className={styles.icon}/> Про команду<br/><span className={styles.menuDesc}>Контакти</span></button>
					</>
				)}
			</nav>
		</>
	);
};

const SideMenu = ({ open, onClose }) => {
	const navigate = useNavigate();
	if (!open) return null;
	return ReactDOM.createPortal(
		<SideMenuContent onClose={onClose} navigate={navigate} />,
		document.body
	);
};

export default SideMenu; 