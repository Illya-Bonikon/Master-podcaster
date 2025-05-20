import React from 'react';
import PodcastCard from './PodcastCard';
import styles from './PodcastList.module.css';

const PodcastList = () => {
	const podcasts = [
		{ id: 1, title: 'Трендовий подкаст', description: 'Опис трендового подкасту' },
		{ id: 2, title: 'Рекомендований подкаст', description: 'Опис рекомендованого подкасту' },
	];

	return (
		<div className={styles.list}>
			{podcasts.map(p => (
				<PodcastCard key={p.id} podcast={p} />
			))}
		</div>
	);
};

export default PodcastList; 