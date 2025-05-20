 import React from 'react';
import EpisodeList from '../Episode/EpisodeList';
import styles from './PodcastDetails.module.css';

const PodcastDetails = ({ podcast }) => {
	if (!podcast) {
		podcast = {
			title: 'Тестовий подкаст',
			description: 'Опис тестового подкасту',
			episodes: [
				{
					title: 'Епізод 1',
					description: 'Опис епізоду 1',
				},
				{
					title: 'Епізод 2',
					description: 'Опис епізоду 2',
				},
			],
		};
	}

	return (
		<div className={styles.details}>
			<h2>{podcast.title}</h2>
			
			<div className={styles.desc}>{podcast.description}</div>
			
			<h3>Епізоди</h3>
			<EpisodeList episodes={podcast.episodes} />
		</div>
	);
};

export default PodcastDetails;
