import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  const playEpisode = (episode) => {
    setCurrentEpisode(episode);
    setProgress(0);
    setIsPlaying(true);
  };
  const pauseEpisode = () => setIsPlaying(false);

  return (
    <PlayerContext.Provider value={{ currentEpisode, isPlaying, progress, setProgress, playEpisode, pauseEpisode, volume, setVolume }}>
      {children}
    </PlayerContext.Provider>
  );
}; 