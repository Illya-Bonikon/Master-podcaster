import React, { useContext, useEffect, useState } from 'react';
import common from '../common.module.css';
import PodcastCard from './PodcastCard';
import { UserContext } from '../UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getPublicPodcasts, deletePodcast } from '../../api';

const GlobalPodcasts = () => {
	const { isModerator } = useContext(UserContext);
	const navigate = useNavigate();
	const [podcasts, setPodcasts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const token = localStorage.getItem('token');

	useEffect(() => {
		getPublicPodcasts()

		.then(res => {setPodcasts(res.data)
			console.log(res);
			console.log('GlobalPodcasts useEffect', res.data);
		})
		.catch(e => setError(e.message))
		.finally(() => setLoading(false));
		
	}, []);
	

	const handleDelete = (id) => {
		if (window.confirm('Видалити подкаст? (мок)')) {
		deletePodcast(id, token);
		navigate('/global');
		}
	};

	if (loading) return <div>Завантаження...</div>;
	if (error) return <div>Помилка: {error}</div>;

	return (
		<div className={common.libraryPage} style={{ margin: '2rem 0' }}>
		<h2 style={{ marginBottom: '1.5rem' }}>Глобальні подкасти</h2>
		<div className={common.list}>
			{podcasts.map(p => <PodcastCard key={p.id} podcast={p} showAdd={false} showDelete={isModerator} onDelete={() => handleDelete(p.id)} isModerator={isModerator} />)}
		</div>
		</div>
	);
};

export default GlobalPodcasts; 