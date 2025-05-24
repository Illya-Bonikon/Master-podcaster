import React, { useState, useContext } from 'react';
import styles from './Player.module.css';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';
import { PlayerContext } from './PlayerContext.jsx';

const Player = () => {
	const { currentEpisode, isPlaying, progress, setProgress, playEpisode, pauseEpisode, volume, setVolume } = useContext(PlayerContext);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	return (
		<div className={styles.wrapper}>
			<input
				className={styles.progressBar}
				type="range"
				min="0"
				max={currentEpisode?.duration || 100}
				value={progress}
				onChange={e => setProgress(Number(e.target.value))}
				style={{ '--progress-percent': `${(progress/(currentEpisode?.duration||100))*100}%` }}
			/>

			<div className={styles.player}>
				<div className={styles.left}>
					<button className={styles.controlBtn}><FaStepBackward /></button>
				
					<button
						className={styles.controlBtn}
						onClick={() => isPlaying ? pauseEpisode() : playEpisode(currentEpisode)}
					>
						{isPlaying ? <FaPause /> : <FaPlay />}
					</button>
					
					<button className={styles.controlBtn}><FaStepForward /></button>
				</div>

				<div className={styles.center}>
					<div className={styles.episodeIcon}>🎧</div>
					<div className={styles.episodeInfo}>
						<div className={styles.episodeTitle}>{currentEpisode?.title || 'Назва епізоду'}</div>
						<div className={styles.podcastName}>{currentEpisode?.podcastTitle || 'Назва подкасту'}</div>
					</div>
				</div>
				<span className={styles.time} style={{ marginLeft: 12, fontSize: '1em', color: '#aaa', minWidth: 70, textAlign: 'right'}}>
					{formatTime(progress)}/{formatTime(currentEpisode?.duration || 0)}
				</span>

				<div className={styles.right}>
					<FaVolumeUp className={styles.volumeIcon} />
					<input
					className={styles.volume}
					type="range"
					min="0"
					max="100"
					value={volume}
					onChange={e => setVolume(Number(e.target.value))}
					style={{ '--volume-percent': `${volume}%` }}
					/>
				</div>
			</div>

		</div>
  );
};

export default Player;
