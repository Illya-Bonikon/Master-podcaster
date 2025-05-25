import React, { useContext, useState, useEffect } from 'react';
import styles from './EpisodeList.module.css';
import common from '../common.module.css';
import { FaPlay, FaPause } from 'react-icons/fa';
import { PlayerContext } from '../Layout/PlayerContext.jsx';
import { API_URL, getAudioUrl } from '../../api';

const EpisodeList = ({ episodes, podcastTitle }) => {
	const { playEpisode, currentEpisode, isPlaying } = useContext(PlayerContext);
	const token = localStorage.getItem('token');
	const [audioUrls, setAudioUrls] = useState({});

	useEffect(() => {
		(async () => {
			const urls = {};
			await Promise.all(episodes.map(async (e) => {
				if (e.audioPath) {
					try {
						const res = await getAudioUrl(e.audioPath, token);
						urls[e.id] = res;
					} catch {
						urls[e.id] = undefined;
					}
				}
			}));
			setAudioUrls(urls);
		})();
	}, [episodes, token]);

	if (!episodes || episodes.length === 0) {
		return <div className={common.empty}>Епізодів немає</div>;
	}
	console.log(episodes)
	return (
		<ul className={common.list}>
			{episodes.map((e, index) => (
				<li
					key={index+1}
					className={common.item}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						justifyContent: 'space-between'
					}}
				>
					<div style={{ flex: 1, minWidth: 0 }}>
						
						<div className={common.desc} style={{ textAlign: 'left', marginTop: 4 }}>
							<span className={common.title} style={{ textAlign: 'left' }}> {index + 1}. {e.title}</span>{e.summary}
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 }}>
						<button
							className={common.button}
							onClick={() => playEpisode({ ...e, podcastTitle, audioUrl: audioUrls[e.id] }, episodes.map(ep => ({ ...ep, podcastTitle, audioUrl: audioUrls[ep.id] })))}
							style={{ borderRadius: '50%', marginBottom: 6 }}
							disabled={!audioUrls[e.id]}
							title={isPlaying && currentEpisode?.id === e.id ? 'Пауза' : 'Відтворити'}
						>
							{isPlaying && currentEpisode?.id === e.id ? <FaPause /> : <FaPlay />}
						</button>
						<div style={{ fontSize: '0.9em', color: '#888' }}>
							{e.duration ? `${Math.floor(e.duration / 60)}:${(e.duration % 60).toString().padStart(2, '0')}` : ''}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default EpisodeList;
