import React from 'react';
import styles from './EpisodeList.module.css';
import common from '../common.module.css';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useContext } from 'react';
import { PlayerContext } from '../Layout/PlayerContext.jsx';

const EpisodeList = ({ episodes, podcastTitle }) => {
	const { playEpisode, currentEpisode, isPlaying } = useContext(PlayerContext);

	if (!episodes) {
		episodes = [
			{ id: 1, title: 'Епізод 1', description: 'Опис епізоду 1', duration: 120 },
			{ id: 2, title: 'Епізод 2', description: 'Опис епізоду 2', duration: 90 },
		];
	}	

	return (
		<ul className={common.list}>
			{episodes.map(e => (
				<li key={e.id} className={common.item} style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div className={common.title} style={{ textAlign: 'left' }}>{e.title}</div>
						<div className={common.desc} style={{ textAlign: 'left', marginTop: 4 }}>{e.description}</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
						<button
							className={common.button}
							onClick={() => playEpisode({ ...e, podcastTitle })}
							style={{ borderRadius: '50%', marginBottom: 6 }}
							title={isPlaying && currentEpisode?.id === e.id ? 'Пауза' : 'Відтворити'}
						>
							{isPlaying && currentEpisode?.id === e.id ? <FaPause /> : <FaPlay />}
						</button>
						<div style={{ fontSize: '0.9em', color: '#888' }}>{e.duration ? `${Math.floor(e.duration/60)}:${(e.duration%60).toString().padStart(2,'0')}` : ''}</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default EpisodeList; 