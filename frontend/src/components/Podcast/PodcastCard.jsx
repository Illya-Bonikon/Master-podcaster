import React from 'react';
import styles from './PodcastCard.module.css';


// TODO: додати лого
const PodcastCard = ({ podcast }) => {
	return (
		<div className={styles.card}>
			<div className={styles.title}>{podcast.title}</div>
			<div className={styles.desc}>{podcast.description}</div>
		</div>
	);
};

export default PodcastCard; 