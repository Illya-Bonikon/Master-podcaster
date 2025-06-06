import React, { useState, useEffect } from 'react';
import styles from './LibraryPage.module.css';
import common from '../common.module.css';
import PodcastCard from '../Podcast/PodcastCard';
import { deletePodcast, getMyPodcasts } from '../../api';
import { useNavigate } from 'react-router-dom';

const LibraryPage = () => {
	const navigate = useNavigate();
	const [podcasts, setPodcasts] = useState([]);

	const token = localStorage.getItem('token');

	useEffect(() => {
		getMyPodcasts(token)
			.then(res => {
				setPodcasts(res.data);
			})
			.catch(err => {
				console.error('Error fetching podcasts:', err);
			});
	}, [token]);

	const handleDelete = async (id) => {
		try {
			await deletePodcast(id, token);
			setPodcasts(prev => prev.filter(p => p.id !== id));
		} catch (err) {
			console.error('Error deleting podcast:', err);
		}
	};

	return (
		<div className={common.library}>
			<div className={styles.list}>
				{podcasts.map(p => (
					<PodcastCard
						key={p.id}
						podcast={p}
						showAdd={true}
						showDelete={true}
						onDelete={handleDelete}
					/>
				))}
			</div>
			<div hidden={podcasts.length > 0} className={common.title} style={{fontSize: '2.5rem', marginTop: '2rem'}}>
				У вас ще немає подкастів.
			</div>
		</div>
	);
};

export default LibraryPage;
