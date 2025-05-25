import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const playEpisode = (episode, episodeList = episodes) => {
    setEpisodes(episodeList);
    const idx = episodeList.findIndex(e => e.id === episode.id);
    setCurrentIndex(idx);
    setCurrentEpisode(episode);
    setProgress(0);
    setIsPlaying(true);
  };

  const pauseEpisode = () => setIsPlaying(false);

  const playPrevEpisode = () => {
    if (currentIndex > 0) {
      const prev = episodes[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      setCurrentEpisode(prev);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const playNextEpisode = () => {
    if (currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setCurrentEpisode(next);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  return (
    <PlayerContext.Provider value={{ currentEpisode, isPlaying, progress, setProgress, playEpisode, pauseEpisode, volume, setVolume, episodes, currentIndex, playPrevEpisode, playNextEpisode }}>
      {children}
    </PlayerContext.Provider>
  );
}; 