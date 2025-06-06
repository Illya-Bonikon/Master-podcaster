import React, { useState, useEffect } from 'react';
import EpisodeList from '../Episode/EpisodeList';
import common from '../common.module.css';
import { FaPodcast, FaLock, FaLockOpen } from 'react-icons/fa';
import { getPodcastById, getEpisodes, getImageUrl, fetchImageFile, updatePodcast } from '../../api';
import { useParams } from 'react-router-dom';
import defaultPodcast from '../../assets/defaultPodcast.png';

const PodcastDetails = () => {
	const token = localStorage.getItem('token');

	const [podcast, setPodcast] = useState(null);
	const [episodes, setEpisodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	
	
	const { id } = useParams();	

	useEffect(() => {
		setLoading(true);

		Promise.all([
			getPodcastById(id, token),
			getEpisodes(id, token)
		])
		.then(([podcastRes, episodesRes]) => {
			setPodcast(podcastRes.data);
			setEpisodes(episodesRes.data);
			setError(null);
		})
		.catch(err => {
			console.error('Error fetching podcast or episodes:', err);
			setError('Помилка при завантаженні подкасту або епізодів');
		})
		.finally(() => {
			setLoading(false);
		});
	}, [id]);

	useEffect(() => {
		if (podcast?.imagePath) {
			let revokedUrl = null;
			fetchImageFile(podcast.imagePath)
				.then(res => {
					const url = URL.createObjectURL(res.data);
					setImageUrl(url);
					revokedUrl = url;
				})
				.catch(() => setImageUrl(null));
			return () => {
				if (revokedUrl) URL.revokeObjectURL(revokedUrl);
			};
		} else {
			setImageUrl(null);
		}
	}, [podcast?.imagePath]);

	const toggleVisibility = async () => {
		try {
			await updatePodcast(id, token);
			setPodcast(prev => ({ ...prev, isPublic: !prev.isPublic }));
		} catch (err) {
			console.error('Error toggling podcast visibility:', err);
		}
	};

	if (loading) return <div>Завантаження подкасту...</div>;
	if (error) return <div>{error}</div>;
	if (!podcast) return <div>Подкаст не знайдено.</div>;

	

	return (
		<div className={common.details}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
				{podcast?.imagePath && imageUrl ? (
					imageUrl && (
						<img
							src={imageUrl}
							alt={podcast.title}
							style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #0002' }}
						/>
					)
				) : (
					<img
						src={defaultPodcast}
						alt={podcast.title}
						style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px #0002' }}
					/>
				)}
				<div>
					<div className={common.title} style={{ fontSize: '2rem' }}>
						{podcast.title}
					</div>
					<div className={common.subtitle}>
						{podcast.prompt}
					</div>
					<div className={common.subtitle}>Епізодів: {episodes.length}</div>
				</div>
				<button 
					onClick={toggleVisibility}
					style={{ 
						marginLeft: 'auto',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						fontSize: '1.5rem',
						color: podcast?.isPublic ? '#4CAF50' : '#f44336'
					}}
				>
					{podcast?.isPublic ? <FaLockOpen /> : <FaLock />}
				</button>
			</div>
			
			<EpisodeList episodes={episodes} podcastTitle={podcast.title} />
		</div>
	);
};

export default PodcastDetails;
