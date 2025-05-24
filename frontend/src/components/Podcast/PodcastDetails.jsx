import React from 'react';
import EpisodeList from '../Episode/EpisodeList';
import styles from './PodcastDetails.module.css';
import common from '../common.module.css';
import { FaPodcast } from 'react-icons/fa';

// Сторінка подкасту: іконка, назва, лічильник переглянутих/загальна кількість
const PodcastDetails = ({ podcast, viewedCount = 0 }) => {
	if (!podcast) {
		podcast = {
			title: 'Тестовий подкаст',
			episodes: [
				{ id: 1, title: 'Епізод 1', description: 'Опис епізоду 1', duration: 120 },
				{ id: 2, title: 'Епізод 2', description: 'Опис епізоду 2', duration: 90 },
			],
		};
	}
	const total = podcast.episodes?.length || 0;
	return (
		<div className={common.details}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
				<FaPodcast style={{ fontSize: '2.5rem', flexShrink: 0 }} />
				<div>
					<div className={common.title} style={{ fontSize: '2rem' }}>{podcast.title}</div>
					<div style={{ color: '#888', fontSize: '1.1rem', marginTop: 4 }}>{viewedCount}/{total}</div>
				</div>
			</div>
			{/* Список епізодів без заголовку чи опису */}
			<EpisodeList episodes={podcast.episodes} podcastTitle={podcast.title} />
		</div>
	);
};

export default PodcastDetails;
