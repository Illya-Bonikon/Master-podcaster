import React, { useState } from 'react';
import styles from './Player.module.css';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';

const Player = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(30);
	const [volume, setVolume] = useState(70);

	return (
		<div className={styles.wrapper}>
			<input
				className={styles.progressBar}
				type="range"
				min="0"
				max="100"
				value={progress}
				onChange={e => setProgress(Number(e.target.value))}
				style={{ '--progress-percent': `${progress}%` }}
			/>

			<div className={styles.player}>
				<div className={styles.left}>
					<button className={styles.controlBtn}><FaStepBackward /></button>
				
					<button
						className={styles.controlBtn}
						onClick={() => setIsPlaying(p => !p)}
					>
						{isPlaying ? <FaPause /> : <FaPlay />}
					</button>
					
					<button className={styles.controlBtn}><FaStepForward /></button>
				</div>

				<div className={styles.center}>
					<div className={styles.episodeIcon}>🎧</div>
					<div className={styles.episodeInfo}>
						<div className={styles.episodeTitle}>Назва епізоду</div>
						<div className={styles.podcastName}>Назва подкасту</div>
					</div>
				</div>

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
