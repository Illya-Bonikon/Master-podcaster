import React, { useContext } from 'react';
import common from '../common.module.css';
import PodcastCard from './PodcastCard';
import { UserContext } from '../UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const podcasts = [
  { id: 1, title: 'Глобальний подкаст 1', episodes: [ { title: 'Епізод 1' } ] },
  { id: 2, title: 'Глобальний подкаст 2', episodes: [ { title: 'Епізод 2' }, { title: 'Епізод 3' } ] },
];

const GlobalPodcasts = () => {
  const { isModerator } = useContext(UserContext);
  const navigate = useNavigate();
  const handleDelete = (id) => {
    if (window.confirm('Видалити подкаст? (мок)')) {
		alert('Подкаст видалено (мок)');
		navigate('/global');
    }
  };
  return (
		<div className={common.libraryPage} style={{margin:'2rem 0'}}>
			<h2 style={{marginBottom: '1.5rem'}}>Глобальні подкасти</h2>
			<div className={common.list}>
				{podcasts.map(p => <PodcastCard key={p.id} podcast={p} showAdd={false} showDelete={isModerator} onDelete={handleDelete} isModerator={isModerator} />)}
			</div>
		</div>
  );
};

export default GlobalPodcasts; 