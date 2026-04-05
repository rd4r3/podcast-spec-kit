'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AudioPlayerState {
  currentEpisodeId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isCollapsed: boolean;
}

interface AudioContextType {
  state: AudioPlayerState;
  setCurrentEpisode: (episodeId: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleCollapsed: () => void;
  play: () => void;
  pause: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioPlayerState>({
    currentEpisodeId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isCollapsed: false,
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

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const value: AudioContextType = {
    state,
    setCurrentEpisode,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    toggleCollapsed,
    togglePlayPause,
    play,
    pause,
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
