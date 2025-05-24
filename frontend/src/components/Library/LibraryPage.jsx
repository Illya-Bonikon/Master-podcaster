import React from 'react';
import styles from './LibraryPage.module.css';
import common from '../common.module.css';
import PodcastCard from '../Podcast/PodcastCard';

const LibraryPage = () => {


	const podcasts = [
		{ id: 1, title: 'Мій перший подкаст', episodes: [ { title: 'Перший епізод' }, { title: 'Другий епізод' } ] },
		{ id: 2, title: 'Ще один подкаст', episodes: [ { title: 'Стартовий епізод' } ] },
	];

	const handleDelete = (id) => {
		if (window.confirm('Видалити подкаст? (мок)')) {
			alert('Подкаст видалено (мок)');
		}
	};

	return (
		<div className={common.library}>
			<div className={styles.list}>
				{podcasts.map(p => (
					<PodcastCard key={p.id} podcast={p} showAdd={true} showDelete={true} onDelete={handleDelete} />
				))}
			</div>
		</div>
  );
};

export default LibraryPage; 