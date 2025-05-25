import React, { useState } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './UsersModal.module.css';
import { getUsers } from '../../api';
import { useEffect } from 'react';


const UsersModal = ({ onClose, asPage }) => {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		getUsers(token).then(res => setUsers(res.data)).catch(e => console.error(e));
	}, []);

	const filtered = users.filter(u =>
		u.name.toLowerCase().includes(search.toLowerCase()) ||
		u.email.toLowerCase().includes(search.toLowerCase())
	);

	const handleDelete = (id) => {
		if (window.confirm('Видалити користувача? (мок)')) {
		setUsers(users => users.filter(u => u.id !== id));
		alert('Користувача видалено (мок)');
		}
	};

	return (
		<div className={styles.usersModalCard}>
			<h2 className={styles.usersTitle}>Користувачі <span className={styles.usersCount}>({filtered.length})</span></h2>
			<div className={styles.usersSearchBox}>
				<FaSearch className={styles.usersSearchIcon} />
				<input
					type="text"
					placeholder="Пошук по імені або email..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					className={styles.usersSearchInput}
				/>
			</div>
			<div className={styles.usersListWrapper}>
				<ul className={styles.usersList}>
					{filtered.length === 0 && <li className={styles.usersEmpty}>Нічого не знайдено</li>}
					{filtered.map(u => (
					<li key={u.id} className={styles.usersListItem}>
						<span className={styles.usersListName}>{u.name} <span className={styles.usersListEmail}>({u.email})</span></span>
						<button className={styles.usersDeleteBtn} onClick={() => handleDelete(u.id)}>Видалити</button>
					</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default UsersModal; 