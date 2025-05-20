import React, { useState } from 'react';
import styles from './SearchPage.module.css';

const SearchPage = () => {
	const [query, setQuery] = useState('');
	
	const results = [
		{ id: 1, title: 'Чужий подкаст', description: 'Опис чужого подкасту' },
		{ id: 2, title: 'Ще один подкаст', description: 'Опис ще одного подкасту' },
	];

	return (
		<div className={styles.searchPage}>
			<h2>Пошук подкастів</h2>
			
			<input
				className={styles.input}
				type="text"
				placeholder="Введіть назву або автора..."
				value={query}
				onChange={e => setQuery(e.target.value)}
			/>
			
			<ul className={styles.list}>
				{results.map(r => (
				<li key={r.id} className={styles.item}>
					<div className={styles.title}>{r.title}</div>
					<div className={styles.desc}>{r.description}</div>
				</li>
				))}
			</ul>
		</div>
	);
};

export default SearchPage; 