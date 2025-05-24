import React, { useState, useContext } from 'react';
import PodcastCard from './Podcast/PodcastCard';
import common from './common.module.css';
import { useLocation } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';

const mockPodcasts = [
	{ id: 1, title: 'Глобальний подкаст 1', episodes: [ { title: 'Епізод 1' } ] },
	{ id: 2, title: 'Глобальний подкаст 2', episodes: [ { title: 'Епізод 2' }, { title: 'Епізод 3' } ] },
	{ id: 3, title: 'Tech Talks', episodes: [ { title: 'AI' } ] },
	{ id: 4, title: 'Музика', episodes: [ { title: 'Jazz' } ] },
];

const SearchPage = () => {
	const { isModerator } = useContext(UserContext);
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const query = params.get('query') || '';
	const [search, setSearch] = useState(query);
	const [sort, setSort] = useState('title');
	const [podcasts, setPodcasts] = useState(mockPodcasts);

	let results = podcasts.filter(p =>
		p.title.toLowerCase().includes(search.toLowerCase())
	);

	if (sort === 'title') 
		results = results.sort((a, b) => a.title.localeCompare(b.title));
	else if (sort === 'episodes')
		results = results.sort((a, b) => b.episodes.length - a.episodes.length);

	const handleDelete = (id) => {
		if (window.confirm('Видалити подкаст? (мок)')) {
			setPodcasts(podcasts => podcasts.filter(p => p.id !== id));
			alert('Подкаст видалено (мок)');
		}
	};

	return (
		<div className={common.libraryPage} style={{margin:'2rem 0'}}>
			<h2 style={{marginBottom: '1.5rem'}}>Пошук подкастів</h2>
			
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
				{results.length === 0 && <div style={{ color: '#888', textAlign: 'center', margin: '2rem 0' }}>Нічого не знайдено</div>}
				{results.map(p => <PodcastCard key={p.id} podcast={p} showAdd={false} showDelete={isModerator} onDelete={handleDelete} isModerator={isModerator} />)}
			</div>
		</div>
	);
};
export default SearchPage; 