import React, { useState, useContext, useRef, useEffect } from 'react';
import styles from './Player.module.css';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';
import { PlayerContext } from './PlayerContext.jsx';

const Player = () => {
	const { currentEpisode, isPlaying, progress, setProgress, playEpisode, pauseEpisode, volume, setVolume, episodes, currentIndex, playPrevEpisode, playNextEpisode } = useContext(PlayerContext);
	const audioRef = useRef(null);

	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		if (!audioRef.current) return;
		if (isPlaying) {
			audioRef.current.play().catch(() => {});
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying, currentEpisode]);

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setProgress(audioRef.current.currentTime);
		}
	};

	const handleSeek = (val) => {
		if (audioRef.current) {
			audioRef.current.currentTime = val;
			setProgress(val);
		}
	};

	const handleLoadedMetadata = () => {
		if (audioRef.current && currentEpisode && !currentEpisode.duration) {
			// Можна додати оновлення duration, якщо потрібно
		}
	};

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	const canGoPrev = currentIndex > 0;
	const canGoNext = currentIndex < episodes.length - 1;

	const handlePrev = (e) => {
		e.stopPropagation();
		playPrevEpisode();
	};

	const handleNext = (e) => {
		e.stopPropagation();
		playNextEpisode();
	};

	return (
		<div className={styles.wrapper}>
			{currentEpisode?.audioUrl && (
				<audio
					ref={audioRef}
					src={currentEpisode.audioUrl}
					preload="auto"
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					style={{ display: 'none' }}
				/>
			)}
			<input
				className={styles.progressBar}
				type="range"
				min="0"
				max={currentEpisode?.duration || (audioRef.current?.duration || 100)}
				value={progress}
				onChange={e => handleSeek(Number(e.target.value))}
				style={{ '--progress-percent': `${(progress/(currentEpisode?.duration||audioRef.current?.duration||100))*100}%` }}
				disabled={!currentEpisode?.audioUrl}
			/>

			<div className={styles.player}>
				<div className={styles.left}>
					<button className={styles.controlBtn} onClick={handlePrev} disabled={!canGoPrev}>
						<FaStepBackward />
					</button>
					<button
						className={styles.controlBtn}
						onClick={() => {
							if (!currentEpisode?.audioUrl) return;
							isPlaying ? pauseEpisode() : playEpisode(currentEpisode, episodes);
						}}
						disabled={!currentEpisode?.audioUrl}
					>
						{isPlaying ? <FaPause /> : <FaPlay />}
					</button>
					<button className={styles.controlBtn} onClick={handleNext} disabled={!canGoNext}>
						<FaStepForward />
					</button>
				</div>

				<div className={styles.center}>
					{currentEpisode?.imageUrl ? (
						<img
							src={currentEpisode.imageUrl}
							alt={currentEpisode.podcastTitle || 'Подкаст'}
							style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #0002', marginRight: 12 }}
						/>
					) : (
						<img
							src={"https://4479-91-235-225-85.ngrok-free.app/media/image/ac3235e21f894f6cbd75af4d5a9a9d3a.png"}
							alt={currentEpisode?.podcastTitle || 'Подкаст'}
							style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px #0002', marginRight: 12 }}
						/>
					)}
					<div className={styles.episodeInfo}>
						<div className={styles.podcastTitle}>{currentEpisode?.podcastTitle || 'Назва подкасту'}</div>
					</div>
				</div>
				<span className={styles.time} style={{ marginLeft: 12, fontSize: '1em', color: '#aaa', minWidth: 70, textAlign: 'right'}}>
					{formatTime(progress)}/{formatTime(currentEpisode?.duration || audioRef.current?.duration || 0)}
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
						disabled={!currentEpisode?.audioUrl}
					/>
				</div>
			</div>

		</div>
	);
};

export default Player;
