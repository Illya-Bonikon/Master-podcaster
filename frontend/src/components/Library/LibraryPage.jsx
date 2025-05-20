import React from 'react';
import styles from './LibraryPage.module.css';

const LibraryPage = () => {

	// TODO - фетчить з API (мб React Query)

	const podcasts = [
		{ id: 1, title: 'Мій перший подкаст', description: 'Опис першого подкасту' },
		{ id: 2, title: 'Ще один подкаст', description: 'Опис другого подкасту' },
	];

	return (
		<div className={styles.library}>
	
			<h2>Моя бібліотека</h2>
	
			
			// TODO - Додати лого, мб кіклькість епізодів, мб останній прогляянтуий епізод	
			// TODO - переробити на карточки
			
			<ul className={styles.list}>
				{podcasts.map(p => (
				<li key={p.id} className={styles.item}>
					<div className={styles.title}>{p.title}</div>
					<div className={styles.desc}>{p.description}</div>
				</li>
				))}
			</ul>
		</div>
  );
};

export default LibraryPage; 