import React from 'react';
import styles from './EpisodeList.module.css';

const EpisodeList = ({ episodes }) => {

	// TODO - фетчить з API (мб React Query)

	if (!episodes) {
		episodes = [
			{ id: 1, title: 'Епізод 1', description: 'Опис епізоду 1' },
			{ id: 2, title: 'Епізод 2', description: 'Опис епізоду 2' },
		];
	}	

	return (
		<ul className={styles.list}>
		{episodes.map(e => (
			<li key={e.id} className={styles.item}>
			<div className={styles.title}>{e.title}</div>
			<div className={styles.desc}>{e.description}</div>
			</li>
		))}
		</ul>
	);
};

export default EpisodeList; 