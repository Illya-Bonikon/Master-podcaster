import React, { useState } from 'react';
import styles from './Player.module.css';

	const Player = () => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(30); 
	const [volume, setVolume] = useState(70); 

	return (
		<div className={styles.player}>
			<button className={styles.btn} onClick={() => setIsPlaying(p => !p)}>
				{isPlaying ? '⏸' : '▶️'}
			</button>
			
			<input
				className={styles.progress}
				type="range"
				min="0"
				max="100"
				value={progress}
				onChange={e => setProgress(Number(e.target.value))}
			/>
			
			<input
				className={styles.volume}
				type="range"
				min="0"
				max="100"
				value={volume}
				onChange={e => setVolume(Number(e.target.value))}
			/>
		</div>
  );
};

export default Player; 