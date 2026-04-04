'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AudioPlayerState {
  currentEpisodeId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface AudioContextType {
  state: AudioPlayerState;
  setCurrentEpisode: (episodeId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioPlayerState>({
    currentEpisodeId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  const setCurrentEpisode = useCallback((episodeId: string) => {
    setState((prev) => ({ ...prev, currentEpisodeId: episodeId }));
  }, []);

  const setIsPlaying = useCallback((isPlaying: boolean) => {
    setState((prev) => ({ ...prev, isPlaying }));
  }, []);

  const setCurrentTime = useCallback((currentTime: number) => {
    setState((prev) => ({ ...prev, currentTime }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState((prev) => ({ ...prev, duration }));
  }, []);

  const value: AudioContextType = {
    state,
    setCurrentEpisode,
    setIsPlaying,
    setCurrentTime,
    setDuration,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
