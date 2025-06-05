import React, { useState, useContext, useEffect } from 'react';
import PodcastCard from './Podcast/PodcastCard';
import common from './common.module.css';
import { useLocation } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import { getPublicPodcasts, getMyPodcasts, getAllPodcastsAdmin, deletePodcast } from '../api';


const SearchPage = () => {
	const { isModerator } = useContext(UserContext);
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const query = params.get('query') || '';
	const [search, setSearch] = useState(query);
	const [sort, setSort] = useState('title');
	const [podcasts, setPodcasts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const token = localStorage.getItem('token');

	useEffect(() => {
		setLoading(true);
		if (isModerator) {
			getAllPodcastsAdmin(token)
				.then(res => setPodcasts(res.data))
				.catch(e => setError(e.message))
				.finally(() => setLoading(false));
		} else {
			Promise.all([
				getPublicPodcasts(),
				getMyPodcasts(token)
			])
				.then(([pubRes, myRes]) => {
					const all = [...pubRes.data, ...myRes.data];
					const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
					setPodcasts(unique);
				})
				.catch(e => setError(e.message))
				.finally(() => setLoading(false));
		}
	}, [isModerator, token]);

	let results = podcasts.filter(p =>
		p.title.toLowerCase().includes(search.toLowerCase())
	);

	if (sort === 'title')
		results = results.sort((a, b) => a.title.localeCompare(b.title));
	else if (sort === 'episodes')
		results = results.sort((a, b) => (b.episodes?.length || 0) - (a.episodes?.length || 0));

	const handleDelete = async (id) => {
		
		try {
			await deletePodcast(id, token);
			setPodcasts(podcasts => podcasts.filter(p => p.id !== id));
		} catch (e) {
			alert('Помилка при видаленні подкасту: ' + (e?.response?.data?.message || e.message));
		}
	
	};

	return (
		<div className={common.libraryPage} style={{margin:'2rem 0'}}>
			<h2 style={{marginBottom: '1.5rem'}}>Пошук подкастів</h2>
			{loading && <div>Завантаження...</div>}
			{error && <div style={{color:'red'}}>{error}</div>}
			<div className="search-bar-row">
				<input
					type="text"
					placeholder="Введіть назву подкасту..."
					value={search}
					onChange={e => setSearch(e.target.value)}
					style={{ flex: 1, padding: '0.7em 1em', borderRadius: 8, border: '1px solid #aaa', fontSize: 16 }}
				/>
				<select value={sort} onChange={e => setSort(e.target.value)} className="search-sort-select" style={{ borderRadius: 8, padding: '0.7em 1em' }}>
					<option value="title">За назвою</option>
					<option value="episodes">За кількістю епізодів</option>
				</select>
			</div>
			<div className={common.list}>
				{!loading && results.length === 0 && <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>Нічого не знайдено</div>}
				{results.map(p => <PodcastCard key={p.id} podcast={p} showAdd={false} showDelete={isModerator} onDelete={handleDelete} isModerator={isModerator} />)}
			</div>
		</div>
	);
};
export default SearchPage; 